import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from backend.app.extensions import db
from backend.app.models.user import User
from backend.app.models.student import StudentProfile
from backend.app.models.skill_gap import SkillGap, RoadmapTask
from backend.app.services.skill_gap_service import analyze_student_skill_gap, ROLE_REQUIREMENTS_MAP

skill_gap_bp = Blueprint('skill_gap', __name__, url_prefix='/api/skill-gap')

def get_current_student():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or not user.student_profile:
        return None
    return user.student_profile

@skill_gap_bp.route('', methods=['GET'])
@jwt_required()
def get_skill_gap():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    target_role = request.args.get('target_role') or student.target_role or 'Software Developer'
    skills = list(student.student_skills.all())

    gap_analysis = analyze_student_skill_gap(skills, target_role)
    
    # Fetch or seed student roadmap tasks
    tasks = student.roadmap_tasks.order_by(RoadmapTask.week_number.asc()).all()
    if not tasks:
        for item in gap_analysis['roadmap']:
            t = RoadmapTask(
                student_id=student.id,
                week_number=item['week'],
                title=item['title'],
                topic=item['topic'],
                description=item['description'],
                recommended_resources_json=json.dumps(item['resources']),
                is_completed=False
            )
            db.session.add(t)
        db.session.commit()
        tasks = student.roadmap_tasks.order_by(RoadmapTask.week_number.asc()).all()

    available_roles = list(ROLE_REQUIREMENTS_MAP.keys())

    return jsonify({
        'analysis': gap_analysis,
        'roadmap_tasks': [t.to_dict() for t in tasks],
        'available_roles': available_roles
    }), 200

@skill_gap_bp.route('/target-role', methods=['POST'])
@jwt_required()
def set_target_role():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    data = request.get_json() or {}
    new_role = data.get('target_role', '').strip()
    if not new_role:
        return jsonify({'error': 'Target role is required'}), 400

    student.target_role = new_role
    skills = list(student.student_skills.all())
    gap_analysis = analyze_student_skill_gap(skills, new_role)

    # Regenerate roadmap tasks
    RoadmapTask.query.filter_by(student_id=student.id).delete()
    for item in gap_analysis['roadmap']:
        t = RoadmapTask(
            student_id=student.id,
            week_number=item['week'],
            title=item['title'],
            topic=item['topic'],
            description=item['description'],
            recommended_resources_json=json.dumps(item['resources']),
            is_completed=False
        )
        db.session.add(t)
    
    db.session.commit()
    tasks = student.roadmap_tasks.order_by(RoadmapTask.week_number.asc()).all()

    return jsonify({
        'message': f"Target role updated to '{new_role}'",
        'analysis': gap_analysis,
        'roadmap_tasks': [t.to_dict() for t in tasks]
    }), 200

@skill_gap_bp.route('/roadmap-task/<int:task_id>/toggle', methods=['POST'])
@jwt_required()
def toggle_roadmap_task(task_id):
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    task = RoadmapTask.query.filter_by(id=task_id, student_id=student.id).first()
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    task.is_completed = not task.is_completed
    task.completed_at = datetime.utcnow() if task.is_completed else None
    db.session.commit()

    return jsonify({
        'message': f"Task marked as {'completed' if task.is_completed else 'pending'}",
        'task': task.to_dict()
    }), 200
