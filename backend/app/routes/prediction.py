from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app.extensions import db
from backend.app.models.user import User
from backend.app.models.student import StudentProfile
from backend.app.models.prediction import Prediction, PredictionHistory
from backend.app.services.prediction_service import run_placement_prediction_for_student
from backend.app.services.cgpa_prediction_service import calculate_cgpa_trajectory

prediction_bp = Blueprint('prediction', __name__, url_prefix='/api/prediction')

def get_current_student():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or not user.student_profile:
        return None
    return user.student_profile

@prediction_bp.route('/run', methods=['POST'])
@jwt_required()
def run_prediction():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    prediction = run_placement_prediction_for_student(student)
    return jsonify({
        'message': 'Placement prediction analysis generated successfully',
        'prediction': prediction.to_dict()
    }), 201

@prediction_bp.route('/latest', methods=['GET'])
@jwt_required()
def get_latest_prediction():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    prediction = student.predictions.first()
    if not prediction:
        # Run auto prediction on first visit
        prediction = run_placement_prediction_for_student(student)

    return jsonify({'prediction': prediction.to_dict()}), 200

@prediction_bp.route('/history', methods=['GET'])
@jwt_required()
def get_prediction_history():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    histories = student.prediction_histories.order_by(PredictionHistory.recorded_at.asc()).all()
    
    # If history is empty, populate demo progression points
    if not histories:
        from datetime import datetime, timedelta
        now = datetime.utcnow()
        demo_points = [
            (now - timedelta(days=90), 62.0, 64.0, '3 Months Ago'),
            (now - timedelta(days=60), 71.0, 72.0, '2 Months Ago'),
            (now - timedelta(days=30), 76.5, 78.0, 'Last Month'),
            (now, 82.0, 83.5, 'Current')
        ]
        history_list = []
        for dt, p, r, lbl in demo_points:
            history_list.append({
                'month_label': lbl,
                'placement_probability': p,
                'readiness_score': r,
                'cgpa': round(student.academic_record.current_cgpa if student.academic_record else 7.5, 2),
                'recorded_at': dt.isoformat()
            })
        return jsonify({'history': history_list}), 200

    return jsonify({'history': [h.to_dict() for h in histories]}), 200

@prediction_bp.route('/cgpa', methods=['GET'])
@jwt_required()
def get_cgpa_forecast():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    academic = student.academic_record
    current_cgpa = float(academic.current_cgpa) if academic else 7.0
    semester_records = list(student.semester_records.all())

    trajectory = calculate_cgpa_trajectory(student, current_cgpa, semester_records)
    return jsonify({'trajectory': trajectory}), 200
