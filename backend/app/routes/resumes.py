import os
import json
from flask import Blueprint, request, jsonify, send_file, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from backend.app.extensions import db
from backend.app.models.user import User
from backend.app.models.student import StudentProfile
from backend.app.models.resume import Resume
from backend.app.services.resume_service import analyze_resume_text_or_metadata

resumes_bp = Blueprint('resumes', __name__, url_prefix='/api/resumes')

def get_current_student():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or not user.student_profile:
        return None
    return user.student_profile

@resumes_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    file = request.files.get('file')
    filename = 'resume.pdf'
    file_size_kb = 120.0
    text_content = ""

    upload_folder = current_app.config['UPLOAD_FOLDER']
    os.makedirs(upload_folder, exist_ok=True)

    if file and file.filename != '':
        orig_name = secure_filename(file.filename)
        filename = f"resume_{student.enrollment_no}_{orig_name}"
        save_path = os.path.join(upload_folder, filename)
        file.save(save_path)
        file_size_kb = os.path.getsize(save_path) / 1024.0
    else:
        # Virtual / simulated resume payload support
        filename = f"resume_{student.enrollment_no}.pdf"
        save_path = os.path.join(upload_folder, filename)
        if not os.path.exists(save_path):
            with open(save_path, 'w') as f:
                f.write(f"Sample resume for {student.full_name} ({student.enrollment_no})")

    # Perform ATS Analysis
    ats_result = analyze_resume_text_or_metadata(text_content, filename)

    # Deactivate previous active resumes
    for old in student.resumes.all():
        old.is_active = False

    resume = Resume(
        student_id=student.id,
        filename=filename,
        file_path=save_path,
        file_size_kb=file_size_kb,
        ats_score=ats_result['ats_score'],
        ats_breakdown_json=json.dumps(ats_result['ats_breakdown']),
        detected_skills_json=json.dumps(ats_result['detected_skills']),
        recommendations_json=json.dumps(ats_result['recommendations']),
        is_active=True
    )
    db.session.add(resume)
    student.calculate_completion()
    db.session.commit()

    return jsonify({
        'message': 'Resume uploaded and analyzed successfully',
        'resume': resume.to_dict()
    }), 201

@resumes_bp.route('/latest', methods=['GET'])
@jwt_required()
def get_latest_resume():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    resume = student.resumes.filter_by(is_active=True).first() or student.resumes.first()
    if not resume:
        return jsonify({'resume': None}), 200

    return jsonify({'resume': resume.to_dict()}), 200

@resumes_bp.route('/download/<int:resume_id>', methods=['GET'])
def download_resume(resume_id):
    resume = Resume.query.get(resume_id)
    if not resume or not os.path.exists(resume.file_path):
        return jsonify({'error': 'File not found'}), 404

    return send_file(resume.file_path, as_attachment=True, download_name=resume.filename)
