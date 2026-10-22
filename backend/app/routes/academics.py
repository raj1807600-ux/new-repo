from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import numpy as np
from backend.app.extensions import db
from backend.app.models.user import User
from backend.app.models.academic import AcademicRecord, SemesterRecord
from backend.app.services.cgpa_prediction_service import calculate_cgpa_trajectory

academics_bp = Blueprint('academics', __name__, url_prefix='/api/student/academics')

def get_current_student():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or not user.student_profile:
        return None
    return user.student_profile

@academics_bp.route('', methods=['GET'])
@jwt_required()
def get_academics():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    academic = student.academic_record
    semester_records = list(student.semester_records.all())
    
    # Calculate trajectory
    current_cgpa = float(academic.current_cgpa) if academic else 7.0
    trajectory = calculate_cgpa_trajectory(student, current_cgpa, semester_records)

    return jsonify({
        'academic_record': academic.to_dict() if academic else None,
        'semester_records': [s.to_dict() for s in semester_records],
        'trajectory': trajectory
    }), 200

@academics_bp.route('', methods=['POST', 'PUT'])
@jwt_required()
def save_academics():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    data = request.get_json() or {}
    academic = student.academic_record
    if not academic:
        academic = AcademicRecord(student_id=student.id)
        db.session.add(academic)

    if 'current_cgpa' in data:
        academic.current_cgpa = min(10.0, max(0.0, float(data['current_cgpa'])))
    if 'tenth_percentage' in data:
        academic.tenth_percentage = min(100.0, max(0.0, float(data['tenth_percentage'])))
    if 'twelfth_percentage' in data and data['twelfth_percentage'] is not None:
        academic.twelfth_percentage = min(100.0, max(0.0, float(data['twelfth_percentage'])))
    if 'diploma_percentage' in data and data['diploma_percentage'] is not None:
        academic.diploma_percentage = min(100.0, max(0.0, float(data['diploma_percentage'])))
    if 'active_backlogs' in data:
        academic.active_backlogs = max(0, int(data['active_backlogs']))
    if 'history_backlogs' in data:
        academic.history_backlogs = max(academic.active_backlogs, int(data['history_backlogs']))
    if 'attendance_percentage' in data:
        academic.attendance_percentage = min(100.0, max(0.0, float(data['attendance_percentage'])))

    student.calculate_completion()
    db.session.commit()

    return jsonify({
        'message': 'Academic records updated successfully',
        'academic_record': academic.to_dict()
    }), 200

@academics_bp.route('/semesters', methods=['POST'])
@jwt_required()
def save_semester_record():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    data = request.get_json() or {}
    sem_num = int(data.get('semester_number', 1))
    sgpa = min(10.0, max(0.0, float(data.get('sgpa', 7.0))))
    credits = float(data.get('credits', 24.0))
    backlogs = int(data.get('backlogs_in_sem', 0))

    record = SemesterRecord.query.filter_by(student_id=student.id, semester_number=sem_num).first()
    if not record:
        record = SemesterRecord(student_id=student.id, semester_number=sem_num)
        db.session.add(record)

    record.sgpa = sgpa
    record.percentage = round(sgpa * 9.5, 2)
    record.credits = credits
    record.backlogs_in_sem = backlogs

    # Auto-recalculate current CGPA from all semesters
    db.session.flush()
    all_sems = SemesterRecord.query.filter_by(student_id=student.id).all()
    if all_sems and student.academic_record:
        student.academic_record.current_cgpa = float(np.mean([s.sgpa for s in all_sems]))

    student.calculate_completion()
    db.session.commit()

    return jsonify({
        'message': f"Semester {sem_num} saved successfully",
        'semester_record': record.to_dict(),
        'updated_cgpa': student.academic_record.current_cgpa if student.academic_record else None
    }), 200
