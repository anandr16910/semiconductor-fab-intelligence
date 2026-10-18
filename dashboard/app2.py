
import streamlit as st
import requests

API_URL = "https://fab-copilot-api-555371502170.us-central1.run.app"

st.set_page_config(
    page_title="Semiconductor Fab Intelligence",
    page_icon="🔬",
    layout="wide"
)

st.title("🔬 Semiconductor Fab Intelligence")
st.caption("AI-powered semiconductor process monitoring")

st.sidebar.header("Process Parameters")

pressure = st.sidebar.number_input(
    "Chamber Pressure (mTorr)",
    value=15.5,
    min_value=0.0,
    max_value=50.0,
    step=0.1
)

power = st.sidebar.number_input(
    "RF Power (W)",
    value=1850.0,
    min_value=500.0,
    max_value=3000.0,
    step=10.0
)

analyze = st.sidebar.button(
    "🔍 Analyze Process"
)

st.divider()

col1, col2 = st.columns(2)

with col1:
    st.metric(
        "Chamber Pressure",
        f"{pressure:.1f} mTorr"
    )

with col2:
    st.metric(
        "RF Power",
        f"{power:.0f} W"
    )

if analyze:

    payload = {
        "chamber_pressure": pressure,
        "rf_power": power
    }

    st.write("Sending request to Cloud Run...")

    try:

        response = requests.post(
            f"{API_URL}/predict",
            json=payload,
            timeout=60
        )

        st.write(
            "HTTP status:",
            response.status_code
        )

        if response.status_code == 200:

            result = response.json()

            st.success(
                "Prediction received successfully"
            )

            st.subheader("Prediction")

            st.json(result)

            status = result.get(
                "status",
                "Unknown"
            )

            if status == "Anomaly Detected":

                st.error(
                    "🔴 ANOMALY DETECTED"
                )

            else:

                st.success(
                    "🟢 PROCESS NORMAL"
                )

            historical = result.get(
                "historical_context"
            )

            if historical:

                st.subheader(
                    "📊 Historical Evidence"
                )

                st.json(historical)

            diagnosis = result.get(
                "ai_diagnosis"
            )

            if diagnosis:

                st.subheader(
                    "🤖 AI Diagnosis"
                )

                st.write(diagnosis)

        else:

            st.error(
                f"Cloud Run returned HTTP "
                f"{response.status_code}"
            )

            st.code(response.text)

    except Exception as e:

        st.error(
            "Unable to connect to Cloud Run"
        )

        st.exception(e)

else:

    st.info(
        "Enter process parameters and click "
        "**Analyze Process**."
    )

