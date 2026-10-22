from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from backend.app.extensions import db
from backend.app.models.user import User
from backend.app.models.student import StudentProfile
from backend.app.models.academic import AcademicRecord

student_bp = Blueprint('student', __name__, url_prefix='/api/student')

def get_current_student():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or not user.student_profile:
        return None
    return user.student_profile

@student_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    student.calculate_completion()
    db.session.commit()

    academic = student.academic_record.to_dict() if student.academic_record else None
    latest_prediction = student.predictions.first()
    
    return jsonify({
        'student': student.to_dict(),
        'academic': academic,
        'completion_percentage': student.profile_completion,
        'latest_prediction': latest_prediction.to_dict() if latest_prediction else None
    }), 200

@student_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    data = request.get_json() or {}
    
    if 'full_name' in data:
        student.full_name = data['full_name'].strip()
    if 'phone' in data:
        student.phone = data['phone'].strip()
    if 'gender' in data:
        student.gender = data['gender'].strip()
    if 'date_of_birth' in data and data['date_of_birth']:
        try:
            student.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
        except Exception:
            pass
    if 'address' in data:
        student.address = data['address'].strip()
    if 'city' in data:
        student.city = data['city'].strip()
    if 'state' in data:
        student.state = data['state'].strip()
    if 'branch' in data:
        student.branch = data['branch'].strip()
    if 'degree' in data:
        student.degree = data['degree'].strip()
    if 'current_semester' in data:
        student.current_semester = int(data['current_semester'])
    if 'passing_year' in data:
        student.passing_year = int(data['passing_year'])
    if 'target_role' in data:
        student.target_role = data['target_role'].strip()
    if 'bio' in data:
        student.bio = data['bio'].strip()
    if 'avatar_url' in data:
        student.avatar_url = data['avatar_url'].strip()

    student.calculate_completion()
    db.session.commit()

    return jsonify({
        'message': 'Profile updated successfully',
        'student': student.to_dict(),
        'completion_percentage': student.profile_completion
    }), 200
