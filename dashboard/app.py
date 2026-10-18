
import streamlit as st
import requests
import pandas as pd
import plotly.express as px

# ---------------------------------------------------------
# Configuration
# ---------------------------------------------------------

API_URL = "https://fab-copilot-api-555371502170.us-central1.run.app/predict"

st.set_page_config(
    page_title="Semiconductor Fab Intelligence",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------------------------------------------------------
# Styling
# ---------------------------------------------------------

st.markdown("""
<style>

.main {
    background-color: #f5f7fa;
}

.block-container {
    padding-top: 1.5rem;
    padding-bottom: 2rem;
}

.dashboard-title {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 0.1rem;
}

.dashboard-subtitle {
    color: #667085;
    font-size: 1rem;
    margin-bottom: 1.5rem;
}

.status-normal {
    background-color: #ecfdf3;
    border: 1px solid #abefc6;
    padding: 18px;
    border-radius: 12px;
    color: #067647;
    font-size: 1.3rem;
    font-weight: 700;
}

.status-anomaly {
    background-color: #fef3f2;
    border: 1px solid #fecdca;
    padding: 18px;
    border-radius: 12px;
    color: #b42318;
    font-size: 1.3rem;
    font-weight: 700;
}

.section-title {
    font-size: 1.25rem;
    font-weight: 650;
    margin-top: 1rem;
    margin-bottom: 0.8rem;
}

.ai-box {
    background-color: #f8f9fc;
    border-left: 5px solid #6941c6;
    padding: 20px;
    border-radius: 8px;
}

.footer {
    text-align: center;
    color: #98a2b3;
    font-size: 0.8rem;
    margin-top: 2rem;
}

</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Header
# ---------------------------------------------------------

st.markdown(
    '<div class="dashboard-title">🔬 Semiconductor Fab Intelligence</div>',
    unsafe_allow_html=True
)

st.markdown(
    '<div class="dashboard-subtitle">'
    'AI-powered process monitoring, anomaly detection and operational intelligence'
    '</div>',
    unsafe_allow_html=True
)

# ---------------------------------------------------------
# Sidebar
# ---------------------------------------------------------

with st.sidebar:

    st.header("⚙️ Process Parameters")

    chamber_id = st.text_input(
        "Chamber ID",
        value="ETCH-01"
    )

    pressure = st.number_input(
        "Chamber Pressure (mTorr)",
        min_value=0.0,
        max_value=100.0,
        value=15.5,
        step=0.1
    )

    rf_power = st.number_input(
        "RF Power (W)",
        min_value=0.0,
        max_value=5000.0,
        value=1850.0,
        step=50.0
    )

    analyze = st.button(
        "🔍 Analyze Process",
        use_container_width=True
    )

    st.divider()

    st.caption("AI Pipeline")

    st.markdown("""
    **Vertex AI**
    
    Anomaly Detection
    
    ↓
    
    **BigQuery**
    
    Historical Evidence
    
    ↓
    
    **Gemini**
    
    AI Diagnosis
    """)

# ---------------------------------------------------------
# Initialize session state
# ---------------------------------------------------------

if "result" not in st.session_state:
    st.session_state.result = None

# ---------------------------------------------------------
# API call
# ---------------------------------------------------------

if analyze:

    payload = {
        "chamber_pressure": pressure,
        "rf_power": rf_power
    }

    try:

        with st.spinner("Running AI process analysis..."):

            response = requests.post(
                API_URL,
                json=payload,
                timeout=60
            )

        if response.status_code == 200:

            st.session_state.result = response.json()

        else:

            st.error(
                f"API returned HTTP {response.status_code}: "
                f"{response.text}"
            )

    except requests.exceptions.RequestException as e:

        st.error(f"Unable to connect to Cloud Run API: {e}")

# ---------------------------------------------------------
# Dashboard
# ---------------------------------------------------------

result = st.session_state.result

if result is None:

    st.info(
        "Enter the chamber operating conditions in the sidebar "
        "and click **Analyze Process**."
    )

else:

    status = result.get("status", "Unknown")

    # -----------------------------------------------------
    # Status banner
    # -----------------------------------------------------

    if "Anomaly" in status:

        st.markdown(
            f'<div class="status-anomaly">'
            f'🔴 {status}'
            f'</div>',
            unsafe_allow_html=True
        )

    else:

        st.markdown(
            f'<div class="status-normal">'
            f'🟢 {status}'
            f'</div>',
            unsafe_allow_html=True
        )

    st.write("")

    # -----------------------------------------------------
    # KPI cards
    # -----------------------------------------------------

    col1, col2, col3, col4 = st.columns(4)

    with col1:

        st.metric(
            "Chamber",
            chamber_id
        )

    with col2:

        st.metric(
            "Pressure",
            f"{result.get('chamber_pressure', pressure):.1f} mTorr"
        )

    with col3:

        st.metric(
            "RF Power",
            f"{result.get('rf_power', rf_power):.0f} W"
        )

    with col4:

        raw_prediction = result.get(
            "raw_prediction",
            "N/A"
        )

        st.metric(
            "Model Prediction",
            str(raw_prediction)
        )

    st.divider()

    # -----------------------------------------------------
    # Historical context
    # -----------------------------------------------------

    st.markdown(
        '<div class="section-title">📊 Historical Process Evidence</div>',
        unsafe_allow_html=True
    )

    historical = result.get("historical_context", {})

    similar_count = historical.get(
    "similar_record_count",
    0
    )

    anomaly_count = historical.get(
    "similar_anomaly_count",
    0
    )

    anomaly_rate = historical.get(
    "similar_anomaly_rate",
    0
    )

    h1, h2, h3 = st.columns(3)

    with h1:

        st.metric(
            "Similar Historical Runs",
            similar_count
        )

    with h2:

        st.metric(
            "Similar Anomalies",
            anomaly_count
        )

    with h3:

        st.metric(
            "Historical Anomaly Rate",
            f"{anomaly_rate:.1%}"
            if isinstance(anomaly_rate, (float, int))
            else str(anomaly_rate)
        )

    # -----------------------------------------------------
    # Historical records
    # -----------------------------------------------------

    similar_records = historical.get(
        "similar_records",
        []
    )

    if similar_records:

        df = pd.DataFrame(similar_records)

        st.dataframe(
            df,
            use_container_width=True,
            hide_index=True
        )

    # -----------------------------------------------------
    # AI Diagnosis
    # -----------------------------------------------------

    diagnosis = result.get(
        "ai_diagnosis"
    )

    if diagnosis:

        st.markdown(
            '<div class="section-title">🤖 AI Process Diagnosis</div>',
            unsafe_allow_html=True
        )

        st.markdown(
            f'<div class="ai-box">{diagnosis}</div>',
            unsafe_allow_html=True
        )

    # -----------------------------------------------------
    # Operating point visualization
    # -----------------------------------------------------

    if similar_records:

        st.markdown(
            '<div class="section-title">📈 Process Operating Envelope</div>',
            unsafe_allow_html=True
        )

        plot_df = pd.DataFrame(similar_records)

        if (
            "chamber_pressure" in plot_df.columns
            and "rf_power" in plot_df.columns
        ):

            if "status" in plot_df.columns:

                fig = px.scatter(
                    plot_df,
                    x="chamber_pressure",
                    y="rf_power",
                    color="status",
                    hover_data=[
                        "chamber_pressure",
                        "rf_power",
                        "status"
                    ],
                    title="Historical Operating Conditions"
                )

            else:

                fig = px.scatter(
                    plot_df,
                    x="chamber_pressure",
                    y="rf_power",
                    title="Historical Operating Conditions"
                )

            # Current operating point

            fig.add_scatter(
                x=[pressure],
                y=[rf_power],
                mode="markers",
                marker=dict(
                    size=18,
                    symbol="star"
                ),
                name="Current Process"
            )

            fig.update_layout(
                height=450,
                xaxis_title="Chamber Pressure (mTorr)",
                yaxis_title="RF Power (W)"
            )

            st.plotly_chart(
                fig,
                use_container_width=True
            )

# ---------------------------------------------------------
# Footer
# ---------------------------------------------------------

st.markdown(
    '<div class="footer">'
    'Semiconductor Fab Intelligence • Vertex AI • BigQuery • Gemini • Cloud Run'
    '</div>',
    unsafe_allow_html=True
)



