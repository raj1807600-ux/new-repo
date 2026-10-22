import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import numpy as np
from backend.app.extensions import db
from backend.app.models.user import User
from backend.app.models.student import StudentProfile
from backend.app.models.academic import AcademicRecord
from backend.app.models.company import Company, CompanyCriteria, CompanySkill
from backend.app.models.prediction import Prediction
from backend.app.models.assessment import AssessmentResult
from backend.app.models.system import AdminActivityLog
from backend.app.services.prediction_service import run_placement_prediction_for_student

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def verify_admin():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role not in ['admin', 'tpo']:
        return None
    return user

@admin_bp.route('/statistics', methods=['GET'])
@jwt_required()
def get_institutional_statistics():
    admin = verify_admin()
    if not admin:
        return jsonify({'error': 'Unauthorized: Admin/TPO access required'}), 403

    students = StudentProfile.query.all()
    total_students = len(students)
    
    # Academic & placement calculations
    cgpas = []
    probabilities = []
    readiness_scores = []
    branch_stats = {}
    readiness_distribution = {'Excellent': 0, 'Strong': 0, 'Moderate': 0, 'Developing': 0, 'Needs Improvement': 0}
    
    ready_count = 0
    intervention_count = 0

    for s in students:
        if s.academic_record:
            cgpas.append(s.academic_record.current_cgpa)

        latest_p = s.predictions.first()
        if latest_p:
            probabilities.append(latest_p.placement_probability)
            readiness_scores.append(latest_p.readiness_score)
            readiness_distribution[latest_p.readiness_level] = readiness_distribution.get(latest_p.readiness_level, 0) + 1
            if latest_p.readiness_score >= 70:
                ready_count += 1
            elif latest_p.readiness_score < 50:
                intervention_count += 1

        b = s.branch or 'Other'
        if b not in branch_stats:
            branch_stats[b] = {'count': 0, 'avg_cgpa': [], 'avg_readiness': []}
        branch_stats[b]['count'] += 1
        if s.academic_record:
            branch_stats[b]['avg_cgpa'].append(s.academic_record.current_cgpa)
        if latest_p:
            branch_stats[b]['avg_readiness'].append(latest_p.readiness_score)

    branch_breakdown = []
    for b_name, b_data in branch_stats.items():
        branch_breakdown.append({
            'branch': b_name,
            'student_count': b_data['count'],
            'avg_cgpa': round(float(np.mean(b_data['avg_cgpa'])), 2) if b_data['avg_cgpa'] else 0.0,
            'avg_readiness': round(float(np.mean(b_data['avg_readiness'])), 1) if b_data['avg_readiness'] else 0.0
        })

    active_companies = Company.query.filter_by(is_active=True).count()

    return jsonify({
        'overview': {
            'total_students': total_students,
            'placement_ready_students': ready_count,
            'placement_ready_percentage': round((ready_count / total_students * 100.0), 1) if total_students else 0.0,
            'students_needing_intervention': intervention_count,
            'average_cgpa': round(float(np.mean(cgpas)), 2) if cgpas else 0.0,
            'average_readiness_score': round(float(np.mean(readiness_scores)), 1) if readiness_scores else 0.0,
            'predicted_placement_rate': round(float(np.mean(probabilities)), 1) if probabilities else 0.0,
            'active_placement_drives': active_companies
        },
        'readiness_distribution': readiness_distribution,
        'branch_breakdown': branch_breakdown,
        'top_demanded_skills': ['Java', 'SQL', 'Python', 'Data Structures & Algorithms', 'React', 'REST API', 'Spring Boot', 'Cloud & Docker'],
        'common_skill_gaps': [
            {'skill': 'Spring Boot / Microservices', 'gap_count': int(total_students * 0.42)},
            {'skill': 'Advanced DSA / Graphs', 'gap_count': int(total_students * 0.38)},
            {'skill': 'Cloud / Docker Deployment', 'gap_count': int(total_students * 0.35)},
            {'skill': 'System Design Fundamentals', 'gap_count': int(total_students * 0.28)}
        ]
    }), 200

@admin_bp.route('/students', methods=['GET'])
@jwt_required()
def list_students():
    admin = verify_admin()
    if not admin:
        return jsonify({'error': 'Unauthorized'}), 403

    search = request.args.get('search', '').strip().lower()
    branch = request.args.get('branch')
    semester = request.args.get('semester')
    readiness_tier = request.args.get('readiness')

    query = StudentProfile.query
    if branch:
        query = query.filter_by(branch=branch)
    if semester:
        query = query.filter_by(current_semester=int(semester))

    students = query.order_by(StudentProfile.created_at.desc()).all()
    results = []

    for s in students:
        if search and (search not in s.full_name.lower() and search not in s.enrollment_no.lower() and search not in (s.user.email if s.user else '').lower()):
            continue

        latest_pred = s.predictions.first()
        if readiness_tier and latest_pred and latest_pred.readiness_level.lower() != readiness_tier.lower():
            continue

        results.append({
            'id': s.id,
            'enrollment_no': s.enrollment_no,
            'full_name': s.full_name,
            'email': s.user.email if s.user else '',
            'branch': s.branch,
            'semester': s.current_semester,
            'cgpa': round(s.academic_record.current_cgpa, 2) if s.academic_record else 0.0,
            'active_backlogs': s.academic_record.active_backlogs if s.academic_record else 0,
            'attendance': s.academic_record.attendance_percentage if s.academic_record else 75.0,
            'placement_probability': round(latest_pred.placement_probability, 1) if latest_pred else None,
            'readiness_score': round(latest_pred.readiness_score, 1) if latest_pred else None,
            'readiness_level': latest_pred.readiness_level if latest_pred else 'Pending',
            'best_fit_role': latest_pred.best_fit_role if latest_pred else s.target_role,
            'profile_completion': s.profile_completion
        })

    return jsonify({'students': results, 'total': len(results)}), 200

@admin_bp.route('/students/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student_detail(student_id):
    admin = verify_admin()
    if not admin:
        return jsonify({'error': 'Unauthorized'}), 403

    student = StudentProfile.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    from backend.app.services.report_service import generate_placement_report_data
    report_data = generate_placement_report_data(student)
    return jsonify({'student_details': report_data}), 200

@admin_bp.route('/students/<int:student_id>/predict', methods=['POST'])
@jwt_required()
def trigger_student_prediction(student_id):
    admin = verify_admin()
    if not admin:
        return jsonify({'error': 'Unauthorized'}), 403

    student = StudentProfile.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    prediction = run_placement_prediction_for_student(student)
    return jsonify({
        'message': f"Placement analysis updated for {student.full_name}",
        'prediction': prediction.to_dict()
    }), 200

@admin_bp.route('/companies', methods=['POST'])
@jwt_required()
def create_company():
    admin = verify_admin()
    if not admin:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json() or {}
    name = data.get('name', '').strip()
    job_role = data.get('job_role', '').strip()
    if not name or not job_role:
        return jsonify({'error': 'Company name and job role are required'}), 400

    company = Company(
        name=name,
        logo_url=data.get('logo_url', ''),
        industry=data.get('industry', 'IT / Software Services'),
        website=data.get('website', ''),
        tier=data.get('tier', 'Tier 1'),
        job_role=job_role,
        job_location=data.get('job_location', 'Bhopal / Pune / Bangalore'),
        ctc_min_lpa=float(data.get('ctc_min_lpa', 4.5)),
        ctc_max_lpa=float(data.get('ctc_max_lpa', 7.5)),
        drive_status=data.get('drive_status', 'Upcoming'),
        description=data.get('description', ''),
        selection_process=data.get('selection_process', '1. Online Aptitude & Coding Round\n2. Technical Interview\n3. HR Interview')
    )
    db.session.add(company)
    db.session.flush()

    # Criteria
    criteria = CompanyCriteria(
        company_id=company.id,
        min_cgpa=float(data.get('min_cgpa', 6.5)),
        min_tenth_percentage=float(data.get('min_tenth_percentage', 60.0)),
        min_twelfth_percentage=float(data.get('min_twelfth_percentage', 60.0)),
        max_active_backlogs=int(data.get('max_active_backlogs', 0)),
        eligible_branches_json=json.dumps(data.get('eligible_branches', ['CSE', 'IT', 'EC', 'AIML']))
    )
    db.session.add(criteria)

    # Required Skills
    for skill_name in data.get('required_skills', ['Java', 'SQL', 'Problem Solving']):
        cs = CompanySkill(company_id=company.id, skill_name=skill_name, importance='Mandatory')
        db.session.add(cs)

    # Log admin action
    log = AdminActivityLog(
        user_id=admin.id,
        action='CREATE_COMPANY_DRIVE',
        target_type='Company',
        target_id=str(company.id),
        details=f"Created placement drive for {company.name}"
    )
    db.session.add(log)

    db.session.commit()
    return jsonify({'message': 'Company drive created successfully', 'company': company.to_dict()}), 201

@admin_bp.route('/companies/<int:company_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def manage_company(company_id):
    admin = verify_admin()
    if not admin:
        return jsonify({'error': 'Unauthorized'}), 403

    company = Company.query.get(company_id)
    if not company:
        return jsonify({'error': 'Company not found'}), 404

    if request.method == 'DELETE':
        db.session.delete(company)
        db.session.commit()
        return jsonify({'message': 'Placement drive deleted successfully'}), 200

    data = request.get_json() or {}
    if 'name' in data:
        company.name = data['name']
    if 'job_role' in data:
        company.job_role = data['job_role']
    if 'tier' in data:
        company.tier = data['tier']
    if 'ctc_min_lpa' in data:
        company.ctc_min_lpa = float(data['ctc_min_lpa'])
    if 'ctc_max_lpa' in data:
        company.ctc_max_lpa = float(data['ctc_max_lpa'])
    if 'drive_status' in data:
        company.drive_status = data['drive_status']
    if 'description' in data:
        company.description = data['description']

    if company.criteria:
        if 'min_cgpa' in data:
            company.criteria.min_cgpa = float(data['min_cgpa'])
        if 'max_active_backlogs' in data:
            company.criteria.max_active_backlogs = int(data['max_active_backlogs'])
        if 'eligible_branches' in data:
            company.criteria.eligible_branches_json = json.dumps(data['eligible_branches'])

    db.session.commit()
    return jsonify({'message': 'Company drive updated successfully', 'company': company.to_dict()}), 200
