from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from backend.app.extensions import db
from backend.app.models.user import User
from backend.app.models.student import StudentProfile
from backend.app.models.skill import Skill, StudentSkill
from backend.app.models.portfolio import Certification, Internship, Project

skills_bp = Blueprint('skills', __name__, url_prefix='/api')

def get_current_student():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or not user.student_profile:
        return None
    return user.student_profile

# 1. Master Skills Catalog
@skills_bp.route('/skills', methods=['GET'])
def get_all_skills():
    category = request.args.get('category')
    query = Skill.query
    if category:
        query = query.filter_by(category=category)
    skills = query.order_by(Skill.category, Skill.name).all()
    return jsonify({'skills': [s.to_dict() for s in skills]}), 200

# 2. Student Skills
@skills_bp.route('/student/skills', methods=['GET'])
@jwt_required()
def get_student_skills():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    skills = student.student_skills.all()
    return jsonify({'skills': [s.to_dict() for s in skills]}), 200

@skills_bp.route('/student/skills', methods=['POST'])
@jwt_required()
def add_student_skill():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    data = request.get_json() or {}
    skill_name = data.get('skill_name', '').strip()
    category = data.get('category', 'languages')
    proficiency = data.get('proficiency', 'Intermediate')
    experience_months = int(data.get('experience_months', 6))

    if not skill_name:
        return jsonify({'error': 'Skill name is required'}), 400

    # Find or create master skill
    master_skill = Skill.query.filter(Skill.name.ilike(skill_name)).first()
    if not master_skill:
        master_skill = Skill(name=skill_name, category=category)
        db.session.add(master_skill)
        db.session.flush()

    # Find or create student association
    student_skill = StudentSkill.query.filter_by(student_id=student.id, skill_id=master_skill.id).first()
    if not student_skill:
        student_skill = StudentSkill(student_id=student.id, skill_id=master_skill.id)
        db.session.add(student_skill)

    student_skill.proficiency = proficiency
    student_skill.experience_months = experience_months
    student_skill.proficiency_score = 90 if proficiency == 'Expert' else 75 if proficiency == 'Advanced' else 50 if proficiency == 'Intermediate' else 30

    student.calculate_completion()
    db.session.commit()

    return jsonify({
        'message': 'Skill saved successfully',
        'skill': student_skill.to_dict()
    }), 200

@skills_bp.route('/student/skills/<int:skill_id>', methods=['DELETE'])
@jwt_required()
def delete_student_skill(skill_id):
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    student_skill = StudentSkill.query.filter_by(student_id=student.id, skill_id=skill_id).first()
    if student_skill:
        db.session.delete(student_skill)
        student.calculate_completion()
        db.session.commit()

    return jsonify({'message': 'Skill removed successfully'}), 200

# 3. Certifications
@skills_bp.route('/student/certifications', methods=['GET', 'POST'])
@jwt_required()
def handle_certifications():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    if request.method == 'POST':
        data = request.get_json() or {}
        title = data.get('title', '').strip()
        issuer = data.get('issuing_organization', '').strip()
        if not title or not issuer:
            return jsonify({'error': 'Title and issuing organization are required'}), 400

        cert = Certification(
            student_id=student.id,
            title=title,
            issuing_organization=issuer,
            credential_id=data.get('credential_id', ''),
            credential_url=data.get('credential_url', ''),
            skills_covered=data.get('skills_covered', '')
        )
        db.session.add(cert)
        student.calculate_completion()
        db.session.commit()
        return jsonify({'message': 'Certification added', 'certification': cert.to_dict()}), 201

    certs = student.certifications.all()
    return jsonify({'certifications': [c.to_dict() for c in certs]}), 200

@skills_bp.route('/student/certifications/<int:cert_id>', methods=['DELETE'])
@jwt_required()
def delete_certification(cert_id):
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    cert = Certification.query.filter_by(id=cert_id, student_id=student.id).first()
    if cert:
        db.session.delete(cert)
        student.calculate_completion()
        db.session.commit()
    return jsonify({'message': 'Certification deleted'}), 200

# 4. Internships
@skills_bp.route('/student/internships', methods=['GET', 'POST'])
@jwt_required()
def handle_internships():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    if request.method == 'POST':
        data = request.get_json() or {}
        comp = data.get('company_name', '').strip()
        role = data.get('role', '').strip()
        if not comp or not role:
            return jsonify({'error': 'Company name and role are required'}), 400

        internship = Internship(
            student_id=student.id,
            company_name=comp,
            role=role,
            location=data.get('location', 'Bhopal / Remote'),
            duration_months=int(data.get('duration_months', 3)),
            technologies=data.get('technologies', ''),
            description=data.get('description', ''),
            certificate_url=data.get('certificate_url', '')
        )
        db.session.add(internship)
        student.calculate_completion()
        db.session.commit()
        return jsonify({'message': 'Internship added', 'internship': internship.to_dict()}), 201

    internships = student.internships.all()
    return jsonify({'internships': [i.to_dict() for i in internships]}), 200

@skills_bp.route('/student/internships/<int:internship_id>', methods=['DELETE'])
@jwt_required()
def delete_internship(internship_id):
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    internship = Internship.query.filter_by(id=internship_id, student_id=student.id).first()
    if internship:
        db.session.delete(internship)
        student.calculate_completion()
        db.session.commit()
    return jsonify({'message': 'Internship deleted'}), 200

# 5. Projects
@skills_bp.route('/student/projects', methods=['GET', 'POST'])
@jwt_required()
def handle_projects():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    if request.method == 'POST':
        data = request.get_json() or {}
        title = data.get('title', '').strip()
        technologies = data.get('technologies', '').strip()
        if not title or not technologies:
            return jsonify({'error': 'Project title and technologies are required'}), 400

        complexity = data.get('complexity', 'Intermediate')
        score = 90 if complexity == 'Advanced' else 70 if complexity == 'Intermediate' else 45

        project = Project(
            student_id=student.id,
            title=title,
            category=data.get('category', 'Web Application'),
            technologies=technologies,
            github_url=data.get('github_url', ''),
            live_url=data.get('live_url', ''),
            description=data.get('description', ''),
            team_size=int(data.get('team_size', 1)),
            complexity=complexity,
            complexity_score=score
        )
        db.session.add(project)
        student.calculate_completion()
        db.session.commit()
        return jsonify({'message': 'Project added', 'project': project.to_dict()}), 201

    projects = student.projects.all()
    return jsonify({'projects': [p.to_dict() for p in projects]}), 200

@skills_bp.route('/student/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    project = Project.query.filter_by(id=project_id, student_id=student.id).first()
    if project:
        db.session.delete(project)
        student.calculate_completion()
        db.session.commit()
    return jsonify({'message': 'Project deleted'}), 200
