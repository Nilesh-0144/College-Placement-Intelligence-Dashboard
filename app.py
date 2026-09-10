"""
===================================================================
College Placement Intelligence Dashboard & Prediction System
Technology Stack: Python, Streamlit, Pandas, Scikit-learn, Plotly
Algorithm: Logistic Regression (Binary Classification)
===================================================================
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.figure_factory as ff
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# ---------------------------------------------------------
# 1. PAGE CONFIGURATION
# ---------------------------------------------------------
st.set_page_config(
    page_title="College Placement Intelligence Dashboard",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling for Clean Dashboard Aesthetic
st.markdown("""
    <style>
    .main-title {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1E293B;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        color: #64748B;
        font-size: 1.05rem;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background-color: #F8FAFC;
        border-radius: 10px;
        padding: 15px;
        border: 1px solid #E2E8F0;
    }
    </style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# 2. DATA LOADING & CACHING
# ---------------------------------------------------------
@st.cache_data
def load_data():
    """Loads student placement data from CSV"""
    df = pd.read_csv("placement_data.csv")
    return df

try:
    df = load_data()
except FileNotFoundError:
    st.error("Error: 'placement_data.csv' not found. Please run 'python generate_data.py' first.")
    st.stop()

# ---------------------------------------------------------
# 3. MACHINE LEARNING MODEL TRAINING (LOGISTIC REGRESSION)
# ---------------------------------------------------------
@st.cache_resource
def train_model(data):
    """
    Trains a Logistic Regression pipeline with:
    - Numerical Features: CGPA, 10th_Percentage, 12th_Percentage
    - Categorical Features: Branch, Internship, Skills
    """
    X = data[["Branch", "CGPA", "10th_Percentage", "12th_Percentage", "Internship", "Skills"]]
    y = data["Placed"].map({"Yes": 1, "No": 0})

    # Train / Test split (80% training, 20% testing)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    numeric_features = ["CGPA", "10th_Percentage", "12th_Percentage"]
    categorical_features = ["Branch", "Internship", "Skills"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
        ]
    )

    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", LogisticRegression(random_state=42, max_iter=1000))
    ])

    pipeline.fit(X_train, y_train)

    # Evaluation
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=["Not Placed", "Placed"], output_dict=True)

    return pipeline, acc, cm, report, X_test, y_test

model, model_accuracy, conf_matrix, class_report, X_test, y_test = train_model(df)

# ---------------------------------------------------------
# 4. SIDEBAR CONTROLS & FILTERS
# ---------------------------------------------------------
with st.sidebar:
    st.image("https://img.icons8.com/color/96/graduation-cap.png", width=64)
    st.title("Filters & Settings")
    
    # Filter by Branch
    all_branches = ["All Branches"] + sorted(df["Branch"].unique().tolist())
    selected_branch = st.selectbox("Filter by Branch:", all_branches)
    
    # Filter by Placement Status
    placement_filter = st.radio("Placement Status:", ["All Students", "Placed Only", "Unplaced Only"])
    
    # CGPA Range Slider
    min_cgpa, max_cgpa = float(df["CGPA"].min()), float(df["CGPA"].max())
    cgpa_range = st.slider("CGPA Range:", min_value=min_cgpa, max_value=max_cgpa, value=(min_cgpa, max_cgpa))
    
    st.markdown("---")
    st.info("**College Project Note:**\nLogistic Regression is used because it calculates the mathematical probability of binary outcomes (Placed vs Not Placed) using the Sigmoid function.")

# Filter Dataframe for visuals
filtered_df = df.copy()
if selected_branch != "All Branches":
    filtered_df = filtered_df[filtered_df["Branch"] == selected_branch]

if placement_filter == "Placed Only":
    filtered_df = filtered_df[filtered_df["Placed"] == "Yes"]
elif placement_filter == "Unplaced Only":
    filtered_df = filtered_df[filtered_df["Placed"] == "No"]

filtered_df = filtered_df[(filtered_df["CGPA"] >= cgpa_range[0]) & (filtered_df["CGPA"] <= cgpa_range[1])]

# ---------------------------------------------------------
# 5. DASHBOARD HEADER & KPI CARDS
# ---------------------------------------------------------
st.markdown('<div class="main-title">🎓 College Placement Intelligence Dashboard</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">A Beginner-Friendly Machine Learning & Exploratory Data Analysis System</div>', unsafe_allow_html=True)

# KPI Calculations
total_students = len(filtered_df)
placed_students = len(filtered_df[filtered_df["Placed"] == "Yes"])
placement_rate = (placed_students / total_students * 100) if total_students > 0 else 0
avg_package = filtered_df[filtered_df["Placed"] == "Yes"]["Package"].mean() if placed_students > 0 else 0.0

col1, col2, col3, col4, col5 = st.columns(5)
with col1:
    st.metric("Total Students", f"{total_students}")
with col2:
    st.metric("Students Placed", f"{placed_students}")
with col3:
    st.metric("Placement Rate", f"{placement_rate:.1f}%")
with col4:
    st.metric("Avg Package", f"₹{avg_package:.2f} LPA")
with col5:
    st.metric("ML Model Accuracy", f"{model_accuracy * 100:.1f}%")

st.markdown("---")

# ---------------------------------------------------------
# 6. TABS: DASHBOARD ANALYTICS | MODEL PREDICTION | ML METRICS | DATASET
# ---------------------------------------------------------
tab_analytics, tab_predict, tab_model, tab_data = st.tabs([
    "📊 Placement Analytics", 
    "🔮 Predict Student Placement", 
    "🧠 ML Evaluation & Confusion Matrix", 
    "📋 Student Dataset"
])

# ------------------ TAB 1: CHARTS ------------------
with tab_analytics:
    row1_col1, row1_col2 = st.columns(2)
    
    with row1_col1:
        st.subheader("1. Placement Rate by Branch")
        branch_summary = df.groupby("Branch")["Placed"].apply(lambda s: (s == "Yes").mean() * 100).reset_index(name="Rate")
        fig_branch = px.bar(
            branch_summary, 
            x="Branch", 
            y="Rate", 
            text_auto=".1f", 
            color="Branch",
            labels={"Rate": "Placement Rate (%)"},
            title="Percentage of Students Placed by Department"
        )
        fig_branch.update_layout(showlegend=False, yaxis_range=[0, 100])
        st.plotly_chart(fig_branch, use_container_width=True)

    with row1_col2:
        st.subheader("2. CGPA vs Placement Outcome")
        fig_cgpa = px.box(
            df, 
            x="Placed", 
            y="CGPA", 
            color="Placed",
            points="all",
            color_discrete_map={"Yes": "#10B981", "No": "#EF4444"},
            title="CGPA Distribution by Placement Status"
        )
        st.plotly_chart(fig_cgpa, use_container_width=True)

    row2_col1, row2_col2 = st.columns(2)
    
    with row2_col1:
        st.subheader("3. Internship vs Placement")
        intern_df = df.groupby(["Internship", "Placed"]).size().reset_index(name="Count")
        fig_intern = px.bar(
            intern_df, 
            x="Internship", 
            y="Count", 
            color="Placed", 
            barmode="group",
            color_discrete_map={"Yes": "#10B981", "No": "#EF4444"},
            title="Impact of Prior Internship Experience"
        )
        st.plotly_chart(fig_intern, use_container_width=True)

    with row2_col2:
        st.subheader("4. Average Package by Branch (LPA)")
        placed_df = df[df["Placed"] == "Yes"]
        pkg_branch = placed_df.groupby("Branch")["Package"].mean().reset_index(name="AvgPackage")
        fig_pkg = px.bar(
            pkg_branch, 
            x="Branch", 
            y="AvgPackage", 
            text_auto=".2f",
            color="AvgPackage",
            color_continuous_scale="Blues",
            labels={"AvgPackage": "Average Package (LPA)"},
            title="Average Salary Package per Branch"
        )
        st.plotly_chart(fig_pkg, use_container_width=True)

    st.subheader("5. Company-wise Placements")
    top_companies = placed_df["Company"].value_counts().reset_index()
    top_companies.columns = ["Company", "Students_Hired"]
    fig_comp = px.bar(
        top_companies, 
        x="Students_Hired", 
        y="Company", 
        orientation="h",
        text_auto=True,
        color="Students_Hired",
        color_continuous_scale="Teal",
        title="Top Recruiting Companies by Number of Offers"
    )
    fig_comp.update_layout(yaxis={'categoryorder': 'total ascending'})
    st.plotly_chart(fig_comp, use_container_width=True)

# ------------------ TAB 2: PREDICTION FORM ------------------
with tab_predict:
    st.subheader("Student Details Form")
    st.write("Enter academic and skill credentials to estimate the probability of campus placement.")
    
    with st.form("prediction_form"):
        p_col1, p_col2 = st.columns(2)
        
        with p_col1:
            input_branch = st.selectbox("Select Branch:", ["Computer Science", "Information Technology", "Electronics & Comm.", "Mechanical", "Civil"])
            input_cgpa = st.slider("College CGPA (out of 10):", min_value=5.0, max_value=10.0, value=7.5, step=0.1)
            input_internship = st.radio("Completed Internship?", ["Yes", "No"], horizontal=True)
            
        with p_col2:
            input_10th = st.slider("10th Standard Percentage (%):", min_value=50.0, max_value=100.0, value=78.0, step=0.5)
            input_12th = st.slider("12th Standard Percentage (%):", min_value=50.0, max_value=100.0, value=75.0, step=0.5)
            input_skills = st.selectbox("Primary Skill Domain:", [
                "Python & DSA", "Full Stack Web", "Cloud & DevOps", "Machine Learning", 
                "Java & Spring", "Embedded Systems", "CAD & SolidWorks", "Data Analytics"
            ])
            
        submit_btn = st.form_submit_button("🔮 Predict Placement", use_container_width=True)

    if submit_btn:
        input_data = pd.DataFrame([{
            "Branch": input_branch,
            "CGPA": input_cgpa,
            "10th_Percentage": input_10th,
            "12th_Percentage": input_12th,
            "Internship": input_internship,
            "Skills": input_skills
        }])
        
        prediction = model.predict(input_data)[0]
        prob = model.predict_proba(input_data)[0][1] * 100
        
        st.markdown("---")
        res_col1, res_col2 = st.columns([1, 1])
        
        with res_col1:
            if prediction == 1:
                st.success("### 🎉 Predicted Result: Likely to be Placed")
                st.metric("Placement Probability", f"{prob:.1f}%")
                st.write("**Assessment:** Excellent academic profile with strong matching credentials for upcoming campus drives.")
            else:
                st.error("### ⚠️ Predicted Result: Not Likely to be Placed")
                st.metric("Placement Probability", f"{prob:.1f}%")
                st.write("**Assessment:** Needs improvement. Focus on enhancing CGPA above 7.0, securing a summer internship, and building core projects.")
                
        with res_col2:
            st.info("**Key Contributing Factors & Advice:**")
            tips = []
            if input_cgpa < 7.0:
                tips.append("• **Academic Threshold**: Many tier-1 recruiters require a minimum 7.0 or 7.5 CGPA.")
            else:
                tips.append("• **Strong CGPA**: Your score qualifies you for major recruitment shortlists.")
                
            if input_internship == "No":
                tips.append("• **Hands-on Experience**: Completing a certified internship increases placement odds by ~30%.")
            else:
                tips.append("• **Internship Advantage**: Practical exposure significantly strengthens your interview score.")
                
            tips.append(f"• **Domain Demand**: Skills in '{input_skills}' are actively sought in current hiring cycles.")
            st.markdown("\n".join(tips))

# ------------------ TAB 3: ML METRICS & CONFUSION MATRIX ------------------
with tab_model:
    st.subheader("Model Performance (Logistic Regression)")
    st.write(f"The model was trained on 80% of records ({len(df) - len(y_test)} students) and tested on 20% unseen data ({len(y_test)} students).")
    
    m_col1, m_col2 = st.columns(2)
    
    with m_col1:
        st.write("#### Confusion Matrix Heatmap")
        z_cm = conf_matrix
        x_cm = ['Pred: Not Placed', 'Pred: Placed']
        y_cm = ['Actual: Not Placed', 'Actual: Placed']
        
        fig_cm = ff.create_annotated_heatmap(
            z_cm, x=x_cm, y=y_cm, colorscale='Blues', showscale=True
        )
        fig_cm.update_layout(title="Confusion Matrix", width=450, height=350)
        st.plotly_chart(fig_cm, use_container_width=True)
        
        tn, fp, fn, tp = conf_matrix.ravel()
        st.caption(f"**True Negatives:** {tn} | **False Positives:** {fp} | **False Negatives:** {fn} | **True Positives:** {tp}")

    with m_col2:
        st.write("#### Classification Metrics")
        rep_df = pd.DataFrame(class_report).transpose()
        st.dataframe(rep_df.style.format(precision=2), use_container_width=True)
        
        st.markdown(f"""
        - **Model Accuracy**: **{model_accuracy * 100:.2f}%**
        - **Algorithm**: `LogisticRegression(solver='lbfgs')`
        - **Preprocessing**: `StandardScaler` for numeric scores + `OneHotEncoder` for branch & skills.
        """)

# ------------------ TAB 4: DATASET VIEWER ------------------
with tab_data:
    st.subheader("College Student Placement Dataset")
    st.write(f"Showing **{len(filtered_df)}** records matching current filters.")
    st.dataframe(filtered_df, use_container_width=True)
    
    csv_data = filtered_df.to_csv(index=False).encode('utf-8')
    st.download_button(
        label="📥 Download Filtered Dataset as CSV",
        data=csv_data,
        file_name="placement_data.csv",
        mime="text/csv",
        use_container_width=True
    )
