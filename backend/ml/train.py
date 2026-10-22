import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, roc_auc_score, accuracy_score
from backend.ml.preprocessing import FEATURE_NAMES, ROLES_CATALOG

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

def generate_realistic_placement_dataset(n_samples=2500, random_state=42):
    """
    Generate realistic collegiate engineering dataset based on Oriental Institute historical distributions.
    Features include academic metrics, coding/technical scores, projects, internships, and attendance.
    """
    np.random.seed(random_state)

    # 1. CGPA (Normal around 7.4, bounded 5.0 to 9.8)
    cgpa = np.clip(np.random.normal(7.4, 0.95, n_samples), 5.0, 10.0)
    
    # 2. SGPA Trend (-0.4 to +0.5)
    sgpa_trend = np.clip(np.random.normal(0.05, 0.15, n_samples), -0.5, 0.6)
    
    # 3. 10th & 12th %
    tenth_pct = np.clip(np.random.normal(78.0, 9.0, n_samples), 55.0, 98.0)
    twelfth_pct = np.clip(tenth_pct + np.random.normal(-3.0, 6.0, n_samples), 50.0, 97.0)
    
    # 4. Backlogs
    active_backlogs = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.82, 0.12, 0.04, 0.02])
    history_backlogs = active_backlogs + np.random.choice([0, 1, 2], size=n_samples, p=[0.75, 0.18, 0.07])
    
    # 5. Attendance (70% - 98%)
    attendance_pct = np.clip(np.random.normal(82.0, 7.5, n_samples), 60.0, 100.0)
    
    # 6. Assessments (correlated with CGPA)
    aptitude_score = np.clip(cgpa * 8.5 + np.random.normal(12.0, 10.0, n_samples), 30.0, 99.0)
    technical_score = np.clip(cgpa * 8.2 + np.random.normal(10.0, 11.0, n_samples), 25.0, 98.0)
    coding_score = np.clip(technical_score * 0.9 + np.random.normal(5.0, 12.0, n_samples), 20.0, 99.0)
    communication_score = np.clip(np.random.normal(72.0, 12.0, n_samples), 35.0, 98.0)
    
    # 7. Skills & Portfolio
    skills_count = np.clip(np.random.poisson(6, n_samples), 1, 18)
    advanced_skills_count = np.clip(skills_count * np.random.uniform(0.2, 0.6, n_samples), 0, skills_count).astype(int)
    projects_score = np.clip(skills_count * 8.0 + np.random.normal(25.0, 15.0, n_samples), 10.0, 100.0)
    internships_count = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.45, 0.38, 0.14, 0.03])
    certifications_count = np.random.choice([0, 1, 2, 3, 4], size=n_samples, p=[0.25, 0.35, 0.25, 0.12, 0.03])
    resume_score = np.clip(60.0 + certifications_count * 4.0 + (projects_score / 5.0) + np.random.normal(5.0, 8.0, n_samples), 40.0, 98.0)

    # 8. Latent Placement Propensity (Linear Combination + Sigmoid)
    z = (
        (cgpa - 7.0) * 1.8 +
        (sgpa_trend * 2.5) +
        (attendance_pct - 75.0) * 0.05 -
        (active_backlogs * 2.8) -
        (history_backlogs * 0.6) +
        (aptitude_score - 60.0) * 0.04 +
        (technical_score - 60.0) * 0.05 +
        (coding_score - 55.0) * 0.06 +
        (communication_score - 65.0) * 0.03 +
        (skills_count * 0.18) +
        (advanced_skills_count * 0.35) +
        (projects_score * 0.025) +
        (internships_count * 0.85) +
        (certifications_count * 0.35) +
        (resume_score - 60.0) * 0.03
    )
    
    # Sigmoid to probability
    placement_prob = 1.0 / (1.0 + np.exp(-z))
    # Binary target (Placed vs Unplaced threshold at ~0.5 with realistic noise)
    is_placed = (placement_prob + np.random.normal(0, 0.08, n_samples) >= 0.52).astype(int)

    # Role classification target based on strongest profile dimension
    role_indices = []
    for i in range(n_samples):
        c_score = coding_score[i]
        t_score = technical_score[i]
        comm_score = communication_score[i]
        p_score = projects_score[i]
        
        if c_score > 82 and p_score > 75:
            role_indices.append(1)  # Full Stack Developer
        elif c_score > 80:
            role_indices.append(2)  # Backend Engineer
        elif t_score > 78 and c_score > 70:
            role_indices.append(0)  # Software Developer
        elif comm_score > 80 and cgpa[i] > 7.5:
            role_indices.append(9)  # Technical Consultant
        elif t_score > 75 and p_score > 70:
            role_indices.append(4)  # Data Analyst / AI Engineer
        elif t_score > 70:
            role_indices.append(5)  # Cloud & DevOps Engineer
        elif c_score > 60:
            role_indices.append(3)  # Frontend Engineer
        elif comm_score > 70:
            role_indices.append(6)  # QA & Automation Engineer
        else:
            role_indices.append(0)  # Default Software Developer

    df = pd.DataFrame({
        'cgpa': cgpa,
        'sgpa_trend': sgpa_trend,
        'tenth_pct': tenth_pct,
        'twelfth_pct': twelfth_pct,
        'active_backlogs': active_backlogs,
        'history_backlogs': history_backlogs,
        'attendance_pct': attendance_pct,
        'aptitude_score': aptitude_score,
        'technical_score': technical_score,
        'coding_score': coding_score,
        'communication_score': communication_score,
        'skills_count': skills_count,
        'advanced_skills_count': advanced_skills_count,
        'projects_score': projects_score,
        'internships_count': internships_count,
        'certifications_count': certifications_count,
        'resume_score': resume_score,
        'is_placed': is_placed,
        'target_role_idx': role_indices
    })
    return df

def train_and_save_models():
    os.makedirs(MODELS_DIR, exist_ok=True)
    print("Generating collegiate training dataset for Oriental Institute placement ecosystem...")
    df = generate_realistic_placement_dataset(n_samples=3000)

    X = df[FEATURE_NAMES]
    y_placed = df['is_placed']
    y_role = df['target_role_idx']

    X_train, X_test, y_train, y_test, y_role_train, y_role_test = train_test_split(
        X, y_placed, y_role, test_size=0.2, random_state=42, stratify=y_placed
    )

    # 1. Feature Scaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 2. Placement Classifier Ensemble (Random Forest + Gradient Boosting + Logistic Regression)
    rf = RandomForestClassifier(n_estimators=120, max_depth=8, random_state=42)
    gbm = GradientBoostingClassifier(n_estimators=100, learning_rate=0.08, max_depth=5, random_state=42)
    lr = LogisticRegression(max_iter=1000, random_state=42)

    ensemble = VotingClassifier(
        estimators=[('rf', rf), ('gbm', gbm), ('lr', lr)],
        voting='soft'
    )
    ensemble.fit(X_train_scaled, y_train)

    y_pred_prob = ensemble.predict_proba(X_test_scaled)[:, 1]
    y_pred = ensemble.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    roc = roc_auc_score(y_test, y_pred_prob)

    print(f"Placement Classifier Evaluation -> Accuracy: {acc:.4f}, ROC-AUC: {roc:.4f}")

    # 3. Role Recommendation Model
    role_rf = RandomForestClassifier(n_estimators=100, max_depth=7, random_state=42)
    role_rf.fit(X_train_scaled, y_role_train)
    role_acc = accuracy_score(y_role_test, role_rf.predict(X_test_scaled))
    print(f"Role Recommendation Model -> Accuracy: {role_acc:.4f}")

    # Save artifacts
    scaler_path = os.path.join(MODELS_DIR, 'scaler.joblib')
    placement_model_path = os.path.join(MODELS_DIR, 'placement_ensemble.joblib')
    role_model_path = os.path.join(MODELS_DIR, 'role_classifier.joblib')

    joblib.dump(scaler, scaler_path)
    joblib.dump(ensemble, placement_model_path)
    joblib.dump(role_rf, role_model_path)

    print("All ML models successfully trained and persisted to", MODELS_DIR)
    return {
        'placement_accuracy': float(acc),
        'placement_roc_auc': float(roc),
        'role_accuracy': float(role_acc)
    }

if __name__ == '__main__':
    train_and_save_models()
