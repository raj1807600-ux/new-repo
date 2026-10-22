import json
from datetime import datetime
from backend.app.extensions import db
from backend.app.models.student import StudentProfile
from backend.app.models.prediction import Prediction, PredictionHistory
from backend.app.models.skill_gap import SkillGap, RoadmapTask
from backend.ml.preprocessing import extract_features_from_student
from backend.ml.predict import predict_student_placement
from backend.app.services.cgpa_prediction_service import calculate_cgpa_trajectory
from backend.app.services.skill_gap_service import analyze_student_skill_gap

def run_placement_prediction_for_student(student_profile: StudentProfile) -> Prediction:
    """
    Run full multi-modal placement readiness prediction pipeline for student profile.
    Saves snapshot to Prediction table and updates PredictionHistory.
    """
    academic_record = student_profile.academic_record
    semester_records = list(student_profile.semester_records.all())
    skills = list(student_profile.student_skills.all())
    projects = list(student_profile.projects.all())
    internships = list(student_profile.internships.all())
    certifications = list(student_profile.certifications.all())
    assessment_results = list(student_profile.assessment_results.all())
    resume = student_profile.resumes.first()

    # 1. Extract feature dictionary
    features = extract_features_from_student(
        student_profile=student_profile,
        academic_record=academic_record,
        semester_records=semester_records,
        skills=skills,
        projects=projects,
        internships=internships,
        certifications=certifications,
        assessment_results=assessment_results,
        resume=resume
    )

    # 2. Run ML prediction
    pred_result = predict_student_placement(features)

    # 3. Calculate CGPA trajectory
    current_cgpa = float(academic_record.current_cgpa) if academic_record else 7.0
    cgpa_proj = calculate_cgpa_trajectory(student_profile, current_cgpa, semester_records)

    # 4. Save prediction record
    subscores = pred_result['subscores']
    prediction = Prediction(
        student_id=student_profile.id,
        placement_probability=pred_result['placement_probability'],
        readiness_score=pred_result['readiness_score'],
        readiness_level=pred_result['readiness_level'],
        confidence_score=pred_result['confidence_score'],
        best_fit_role=pred_result['best_fit_role'],
        alternative_roles_json=json.dumps(pred_result['alternative_roles']),
        academic_score=subscores.get('academic', 0.0),
        technical_score=subscores.get('technical', 0.0),
        coding_score=subscores.get('coding', 0.0),
        communication_score=subscores.get('communication', 0.0),
        projects_score=subscores.get('projects', 0.0),
        internships_score=subscores.get('internships', 0.0),
        certifications_score=subscores.get('certifications', 0.0),
        resume_score=subscores.get('resume', 0.0),
        projected_final_cgpa=cgpa_proj['projected_final_cgpa'],
        cgpa_trend_slope=cgpa_proj['trend_slope'],
        model_version='Ensemble-v1.0 (RF+GBM+LR)',
        is_demo=True,
        disclaimer='Predictions are advisory estimates based on student data and do not guarantee placement.'
    )
    db.session.add(prediction)
    db.session.flush()

    # 5. Add to prediction history
    month_str = datetime.utcnow().strftime('%b %Y')
    history = PredictionHistory(
        student_id=student_profile.id,
        prediction_id=prediction.id,
        placement_probability=pred_result['placement_probability'],
        readiness_score=pred_result['readiness_score'],
        cgpa=current_cgpa,
        month_label=month_str
    )
    db.session.add(history)

    # 6. Auto-update Skill Gap analysis for target role
    target_role = student_profile.target_role or pred_result['best_fit_role']
    gap_result = analyze_student_skill_gap(skills, target_role)

    # Find or create skill gap entry
    existing_gap = student_profile.skill_gaps.filter_by(target_role=target_role).first()
    if not existing_gap:
        existing_gap = SkillGap(student_id=student_profile.id, target_role=target_role)
        db.session.add(existing_gap)

    existing_gap.student_skills_json = json.dumps(gap_result['student_skills'])
    existing_gap.required_skills_json = json.dumps(gap_result['required_skills'])
    existing_gap.missing_skills_json = json.dumps(gap_result['missing_skills'])
    existing_gap.primary_gap_area = gap_result['primary_gap_area']
    existing_gap.match_percentage = gap_result['match_percentage']

    # Update student profile completion
    student_profile.calculate_completion()

    db.session.commit()
    return prediction
