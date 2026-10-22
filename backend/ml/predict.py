import numpy as np
from backend.ml.model_loader import ModelLoader
from backend.ml.preprocessing import FEATURE_NAMES, ROLES_CATALOG, features_to_vector

def get_readiness_level(readiness_score: float) -> str:
    """Map readiness score to human-readable tier."""
    if readiness_score >= 90.0:
        return 'Excellent'
    elif readiness_score >= 75.0:
        return 'Strong'
    elif readiness_score >= 60.0:
        return 'Moderate'
    elif readiness_score >= 40.0:
        return 'Developing'
    else:
        return 'Needs Improvement'

def calculate_composite_readiness_score(features: dict) -> tuple[float, dict]:
    """
    Calculate composite readiness score (0-100) from academic, assessment, project,
    skill, internship, and resume components.
    """
    # 1. Academic component (0-100)
    cgpa = features.get('cgpa', 7.0)
    backlogs = features.get('active_backlogs', 0)
    hist_backlogs = features.get('history_backlogs', 0)
    att = features.get('attendance_pct', 75.0)
    
    academic_raw = (cgpa / 10.0) * 80.0 + (att / 100.0) * 20.0 - (backlogs * 15.0) - (hist_backlogs * 4.0)
    academic_score = float(np.clip(academic_raw, 10.0, 100.0))

    # 2. Assessment components
    aptitude_score = float(np.clip(features.get('aptitude_score', 65.0), 0.0, 100.0))
    technical_score = float(np.clip(features.get('technical_score', 65.0), 0.0, 100.0))
    coding_score = float(np.clip(features.get('coding_score', 60.0), 0.0, 100.0))
    communication_score = float(np.clip(features.get('communication_score', 70.0), 0.0, 100.0))

    # 3. Portfolio & Practical components
    projects_score = float(np.clip(features.get('projects_score', 50.0), 10.0, 100.0))
    internships_count = features.get('internships_count', 0)
    internships_score = float(np.clip(internships_count * 40.0 + 20.0, 0.0, 100.0))
    certifications_count = features.get('certifications_count', 0)
    certifications_score = float(np.clip(certifications_count * 30.0 + 15.0, 0.0, 100.0))
    resume_score = float(np.clip(features.get('resume_score', 65.0), 20.0, 100.0))

    # Weighted Composite Formula
    composite = (
        academic_score * 0.20 +
        technical_score * 0.15 +
        coding_score * 0.15 +
        aptitude_score * 0.10 +
        communication_score * 0.10 +
        projects_score * 0.12 +
        internships_score * 0.08 +
        certifications_score * 0.05 +
        resume_score * 0.05
    )
    readiness_score = float(np.clip(composite, 5.0, 99.5))

    subscores = {
        'academic': academic_score,
        'aptitude': aptitude_score,
        'technical': technical_score,
        'coding': coding_score,
        'communication': communication_score,
        'projects': projects_score,
        'internships': internships_score,
        'certifications': certifications_score,
        'resume': resume_score
    }
    return readiness_score, subscores

def predict_student_placement(features: dict) -> dict:
    """
    Run ML prediction pipeline for a student feature dictionary.
    Returns placement probability, readiness score, roles, confidence, and subscores.
    """
    loader = ModelLoader.get_instance()
    readiness_score, subscores = calculate_composite_readiness_score(features)
    readiness_level = get_readiness_level(readiness_score)

    placement_probability = readiness_score * 0.95  # Default calibration
    confidence_score = 86.5
    best_fit_role = 'Software Developer'
    alternative_roles = ['Full Stack Developer', 'Backend Engineer', 'Data Analyst / AI Engineer']

    if loader.scaler and loader.placement_model:
        try:
            vec = features_to_vector(features)
            vec_scaled = loader.scaler.transform(vec)
            
            # Predict probability
            prob_arr = loader.placement_model.predict_proba(vec_scaled)[0]
            ml_placement_prob = float(prob_arr[1] * 100.0)
            # Blend ML probability with composite readiness for stability
            placement_probability = float(np.clip(0.65 * ml_placement_prob + 0.35 * readiness_score, 5.0, 99.0))
            
            # Confidence estimation
            confidence_score = float(np.clip(max(prob_arr) * 100.0 * 0.85 + 15.0, 65.0, 96.0))

            # Role prediction
            if loader.role_model:
                role_probs = loader.role_model.predict_proba(vec_scaled)[0]
                top_role_indices = np.argsort(role_probs)[::-1]
                
                best_fit_idx = top_role_indices[0]
                best_fit_role = ROLES_CATALOG[best_fit_idx] if best_fit_idx < len(ROLES_CATALOG) else 'Software Developer'
                
                alt_roles = []
                for idx in top_role_indices[1:4]:
                    if idx < len(ROLES_CATALOG) and ROLES_CATALOG[idx] != best_fit_role:
                        alt_roles.append(ROLES_CATALOG[idx])
                alternative_roles = alt_roles if alt_roles else ['Backend Engineer', 'Cloud & DevOps Engineer']
        except Exception as e:
            print("ML prediction error, fallback used:", e)

    return {
        'placement_probability': round(placement_probability, 1),
        'readiness_score': round(readiness_score, 1),
        'readiness_level': readiness_level,
        'confidence_score': round(confidence_score, 1),
        'best_fit_role': best_fit_role,
        'alternative_roles': alternative_roles,
        'subscores': {k: round(v, 1) for k, v in subscores.items()}
    }
