
import os

from flask import Flask, request, jsonify

from google.cloud import aiplatform
from google.cloud import bigquery
from google import genai
from google.genai.types import HttpOptions


app = Flask(__name__)


# ============================================================
# CONFIGURATION
# ============================================================

PROJECT_ID = "aisemicon2026"
REGION = "us-central1"
ENDPOINT_ID = "1459250391907565568"

BIGQUERY_DATASET = "fab_ai"
BIGQUERY_TABLE = "chamber_history"

# Gemini location
GEMINI_LOCATION = "global"


# ============================================================
# INITIALIZE VERTEX AI
# ============================================================

aiplatform.init(
    project=PROJECT_ID,
    location=REGION
)

endpoint = aiplatform.Endpoint(ENDPOINT_ID)


# ============================================================
# INITIALIZE BIGQUERY
# ============================================================

bigquery_client = bigquery.Client(
    project=PROJECT_ID
)


# ============================================================
# INITIALIZE GEMINI
# ============================================================

gemini_client = genai.Client(
    vertexai=True,
    project=PROJECT_ID,
    location=GEMINI_LOCATION,
    http_options=HttpOptions(api_version="v1")
)


# ============================================================
# BIGQUERY HISTORICAL ANALYSIS
# ============================================================

def get_historical_context(pressure, power):

    query = f"""
        SELECT
            chamber_pressure,
            rf_power,
            status,
            ABS(chamber_pressure - @pressure) AS pressure_distance,
            ABS(rf_power - @power) AS power_distance
        FROM `{PROJECT_ID}.{BIGQUERY_DATASET}.{BIGQUERY_TABLE}`
        ORDER BY
            (ABS(chamber_pressure - @pressure) / 2.0)
            +
            (ABS(rf_power - @power) / 100.0)
        LIMIT 10
    """

    try:

        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter(
                    "pressure",
                    "FLOAT64",
                    pressure
                ),
                bigquery.ScalarQueryParameter(
                    "power",
                    "FLOAT64",
                    power
                )
            ]
        )

        rows = bigquery_client.query(
            query,
            job_config=job_config
        ).result()

        similar_records = []

        for row in rows:

            similar_records.append({
                "chamber_pressure":
                    float(row.chamber_pressure),

                "rf_power":
                    float(row.rf_power),

                "status":
                    row.status
            })

        # Count similar anomalies
        anomaly_count = sum(
            1
            for record in similar_records
            if record["status"] == "Anomaly"
        )

        total_count = len(similar_records)

        anomaly_rate = (
            anomaly_count / total_count
            if total_count > 0
            else 0
        )

        return {
            "similar_records": similar_records,
            "similar_record_count": total_count,
            "similar_anomaly_count": anomaly_count,
            "similar_anomaly_rate":
                round(anomaly_rate * 100, 2)
        }

    except Exception as e:

        print(f"BigQuery error: {str(e)}")

        return {
            "error": "Historical data unavailable"
        }

# ============================================================
# GEMINI ROOT-CAUSE ANALYSIS
# ============================================================

def generate_ai_diagnosis(
    pressure,
    power,
    prediction,
    status,
    historical_context
):

    prompt = f"""
You are a semiconductor manufacturing operations copilot.

This is a demonstration system using synthetic semiconductor
process data.

Analyze the following process condition.

CURRENT PROCESS
---------------
Chamber pressure: {pressure} mTorr
RF power: {power} W

VERTEX AI ANOMALY MODEL
-----------------------
Prediction: {prediction}
Status: {status}

HISTORICAL BIGQUERY CONTEXT
---------------------------
{historical_context}

Analyze the current process using BOTH:

1. The Vertex AI anomaly prediction
2. Historical operating conditions that are
   similar to the current pressure and RF power

Return:

Diagnosis:
Explain whether the current process appears
consistent with historical anomalous behavior.

Evidence:
Mention the number of similar historical records
and their anomaly rate.

Severity:
LOW, MEDIUM, or HIGH.

Likely Factors:
Identify the most plausible contributing factors.

Recommended Investigation:
Suggest what an engineer should investigate.

Potential Impact:
Explain possible impact on semiconductor
manufacturing quality or yield.

Important:
- Do not claim certainty about physical root cause.
- Distinguish evidence from hypotheses.
- Do not instruct the operator to change a
  production recipe outside an approved process window.

"""

    try:

        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:

        print(f"Gemini error: {str(e)}")

        return "AI diagnosis unavailable."


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/", methods=["GET"])
def health():

    return jsonify({
        "service": "Semiconductor Fab AI Copilot",
        "status": "running"
    })


# ============================================================
# PREDICT ENDPOINT
# ============================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "error": "Request body is required"
            }), 400


        # ----------------------------------------------------
        # Extract process parameters
        # ----------------------------------------------------

        pressure = data.get("chamber_pressure")
        power = data.get("rf_power")


        if pressure is None or power is None:

            return jsonify({
                "error":
                "Missing chamber_pressure or rf_power"
            }), 400


        # Convert to numeric values
        pressure = float(pressure)
        power = float(power)


        # ----------------------------------------------------
        # STEP 1: Vertex AI anomaly prediction
        # ----------------------------------------------------

        instances = [[pressure, power]]

        response = endpoint.predict(
            instances=instances
        )

        result = response.predictions[0]

        # Isolation Forest:
        #  1  = Normal
        # -1  = Anomaly

        status = (
            "Anomaly Detected"
            if result == -1
            else "Normal"
        )


        # ----------------------------------------------------
        # STEP 2: BigQuery historical context
        # ----------------------------------------------------

        historical_context = get_historical_context(
            pressure,
            power
        )


        # ----------------------------------------------------
        # STEP 3: Gemini reasoning
        # ----------------------------------------------------

        ai_diagnosis = generate_ai_diagnosis(
            pressure,
            power,
            result,
            status,
            historical_context
        )


        # ----------------------------------------------------
        # STEP 4: Final response
        # ----------------------------------------------------

        return jsonify({

            "chamber_pressure": pressure,

            "rf_power": power,

            "raw_prediction": result,

            "status": status,

            "historical_context":
                historical_context,

            "ai_diagnosis":
                ai_diagnosis

        }), 200


    except Exception as e:

        print(f"Prediction error: {str(e)}")

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# LOCAL DEVELOPMENT
# ============================================================

if __name__ == "__main__":

    port = int(
        os.environ.get(
            "PORT",
            8080
        )
    )

    app.run(
        host="0.0.0.0",
        port=port
    )

