from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app.extensions import db
from backend.app.models.user import User
from backend.app.models.student import StudentProfile
from backend.app.models.company import Company
from backend.app.services.eligibility_service import check_company_eligibility
from backend.app.services.recommendation_service import get_recommended_companies

companies_bp = Blueprint('companies', __name__, url_prefix='/api/companies')

def get_current_student():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or not user.student_profile:
        return None
    return user.student_profile

@companies_bp.route('', methods=['GET'])
@jwt_required(optional=True)
def list_companies():
    search = request.args.get('search', '').strip().lower()
    tier = request.args.get('tier')
    status_filter = request.args.get('status')
    branch = request.args.get('branch')

    query = Company.query.filter_by(is_active=True)
    if tier:
        query = query.filter_by(tier=tier)
    if branch:
        query = query.filter(Company.criteria.has(Company.criteria.property.mapper.class_.eligible_branches_json.contains(branch)))

    companies = query.order_by(Company.drive_status.asc(), Company.ctc_max_lpa.desc()).all()

    # If logged in as student, attach dynamic eligibility
    student = None
    try:
        student = get_current_student()
    except Exception:
        pass

    results = []
    academic = student.academic_record if student else None
    skills = list(student.student_skills.all()) if student else []

    for c in companies:
        c_dict = c.to_dict()
        if search and (search not in c.name.lower() and search not in c.job_role.lower() and search not in c.industry.lower()):
            continue

        if student:
            eval_res = check_company_eligibility(student, c, academic, skills)
            c_dict['eligibility'] = eval_res
            c_dict['match_percentage'] = eval_res['match_percentage']
            c_dict['student_status'] = eval_res['status']
            
            # Apply student status filter if provided
            if status_filter and eval_res['status'].lower() != status_filter.lower():
                continue
        else:
            c_dict['eligibility'] = None
            c_dict['match_percentage'] = 80.0
            c_dict['student_status'] = 'Eligible'

        results.append(c_dict)

    return jsonify({'companies': results, 'total': len(results)}), 200

@companies_bp.route('/<int:company_id>', methods=['GET'])
@jwt_required()
def get_company(company_id):
    company = Company.query.get(company_id)
    if not company:
        return jsonify({'error': 'Company not found'}), 404

    student = get_current_student()
    academic = student.academic_record if student else None
    skills = list(student.student_skills.all()) if student else []

    c_dict = company.to_dict()
    if student:
        c_dict['eligibility'] = check_company_eligibility(student, company, academic, skills)

    return jsonify({'company': c_dict}), 200

@companies_bp.route('/recommended', methods=['GET'])
@jwt_required()
def get_recommended():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    companies = Company.query.filter_by(is_active=True).all()
    academic = student.academic_record
    skills = list(student.student_skills.all())
    latest_pred = student.predictions.first()
    prob = latest_pred.placement_probability if latest_pred else 75.0

    recommendations = get_recommended_companies(student, companies, academic, skills, prob)
    return jsonify({'recommendations': recommendations[:10]}), 200
