import os
from flask import Blueprint, request, jsonify, send_file, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app.extensions import db
from backend.app.models.user import User
from backend.app.models.student import StudentProfile
from backend.app.services.report_service import generate_placement_report_data, generate_pdf_report

reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')

def get_current_student():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or not user.student_profile:
        return None
    return user.student_profile

@reports_bp.route('/student', methods=['GET'])
@jwt_required()
def get_student_report_data():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    report_data = generate_placement_report_data(student)
    return jsonify({'report': report_data}), 200

@reports_bp.route('/student/pdf', methods=['GET'])
@jwt_required()
def download_student_pdf_report():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    report_data = generate_placement_report_data(student)
    
    reports_folder = current_app.config['REPORTS_FOLDER']
    os.makedirs(reports_folder, exist_ok=True)
    pdf_filename = f"Oriental_Placement_Report_{student.enrollment_no}.pdf"
    pdf_path = os.path.join(reports_folder, pdf_filename)

    generate_pdf_report(report_data, pdf_path)
    return send_file(pdf_path, as_attachment=True, download_name=pdf_filename, mimetype='application/pdf')
