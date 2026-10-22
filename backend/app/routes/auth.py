from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from backend.app.extensions import db, hash_password, check_password
from backend.app.models.user import User
from backend.app.models.student import StudentProfile
from backend.app.models.academic import AcademicRecord, SemesterRecord

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    full_name = data.get('full_name', '').strip()
    enrollment_no = data.get('enrollment_no', '').strip().upper()
    branch = data.get('branch', 'CSE')
    degree = data.get('degree', 'B.Tech')
    current_semester = int(data.get('current_semester', 7))
    passing_year = int(data.get('passing_year', 2026))

    if not email or not password or not full_name or not enrollment_no:
        return jsonify({'error': 'Missing required registration fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'An account with this email already exists'}), 409

    if StudentProfile.query.filter_by(enrollment_no=enrollment_no).first():
        return jsonify({'error': 'An account with this enrollment number already exists'}), 409

    # Create User
    pwd_hash = hash_password(password)
    user = User(email=email, password_hash=pwd_hash, role='student')
    db.session.add(user)
    db.session.flush()

    # Create Student Profile
    student = StudentProfile(
        user_id=user.id,
        enrollment_no=enrollment_no,
        full_name=full_name,
        branch=branch,
        degree=degree,
        current_semester=current_semester,
        passing_year=passing_year,
        target_role='Software Developer'
    )
    db.session.add(student)
    db.session.flush()

    # Create initial Academic Record
    academic = AcademicRecord(
        student_id=student.id,
        current_cgpa=float(data.get('cgpa', 7.5)),
        tenth_percentage=float(data.get('tenth_percentage', 80.0)),
        twelfth_percentage=float(data.get('twelfth_percentage', 78.0)),
        active_backlogs=int(data.get('active_backlogs', 0)),
        history_backlogs=int(data.get('history_backlogs', 0)),
        attendance_percentage=float(data.get('attendance_percentage', 82.0))
    )
    db.session.add(academic)

    # Initialize standard semester records
    base_sgpa = float(data.get('cgpa', 7.5))
    for sem in range(1, current_semester):
        sgpa_val = max(5.0, min(10.0, base_sgpa + (sem * 0.08 - 0.2)))
        sem_rec = SemesterRecord(
            student_id=student.id,
            semester_number=sem,
            sgpa=round(sgpa_val, 2),
            credits=24.0,
            backlogs_in_sem=0,
            subjects_passed=6
        )
        db.session.add(sem_rec)

    student.calculate_completion()
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Registration successful',
        'access_token': token,
        'user': user.to_dict(),
        'student': student.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password(password, user.password_hash):
        return jsonify({'error': 'Invalid email or password'}), 401

    if not user.is_active:
        return jsonify({'error': 'Account is inactive. Contact TPO administrator.'}), 403

    token = create_access_token(identity=str(user.id))
    student_dict = user.student_profile.to_dict() if user.student_profile else None

    return jsonify({
        'message': 'Login successful',
        'access_token': token,
        'user': user.to_dict(),
        'student': student_dict
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    student_dict = user.student_profile.to_dict() if user.student_profile else None
    return jsonify({
        'user': user.to_dict(),
        'student': student_dict
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    user = User.query.filter_by(email=email).first()
    # Return success regardless for security / demo workflow
    return jsonify({
        'message': 'If your email is registered with Oriental Institute, a password recovery link has been dispatched to your institutional inbox.'
    }), 200
