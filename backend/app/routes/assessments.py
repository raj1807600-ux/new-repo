import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app.extensions import db
from backend.app.models.user import User
from backend.app.models.student import StudentProfile
from backend.app.models.assessment import Assessment, AssessmentQuestion, AssessmentResult

assessments_bp = Blueprint('assessments', __name__, url_prefix='/api')

def get_current_student():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or not user.student_profile:
        return None
    return user.student_profile

@assessments_bp.route('/assessments', methods=['GET'])
def list_assessments():
    category = request.args.get('category')
    query = Assessment.query.filter_by(is_active=True)
    if category:
        query = query.filter_by(category=category)
    assessments = query.all()
    return jsonify({'assessments': [a.to_dict(include_questions_count=True) for a in assessments]}), 200

@assessments_bp.route('/assessments/<int:assessment_id>', methods=['GET'])
def get_assessment(assessment_id):
    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({'error': 'Assessment not found'}), 404

    include_answers = request.args.get('include_answers', 'false').lower() == 'true'
    questions = assessment.questions.all()

    return jsonify({
        'assessment': assessment.to_dict(),
        'questions': [q.to_dict(include_correct=include_answers) for q in questions]
    }), 200

@assessments_bp.route('/assessments/<int:assessment_id>/submit', methods=['POST'])
@jwt_required()
def submit_assessment(assessment_id):
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    assessment = Assessment.query.get(assessment_id)
    if not assessment:
        return jsonify({'error': 'Assessment not found'}), 404

    data = request.get_json() or {}
    user_answers = data.get('answers', {})  # Dict mapping question_id -> chosen option index
    time_taken = int(data.get('time_taken_seconds', 0))

    questions = assessment.questions.all()
    total_marks = 0
    earned_marks = 0
    correct_count = 0
    breakdown = {}

    for q in questions:
        q_marks = q.marks or 5
        total_marks += q_marks
        chosen = user_answers.get(str(q.id)) or user_answers.get(q.id)

        if chosen is not None and int(chosen) == q.correct_option_index:
            earned_marks += q_marks
            correct_count += 1
            breakdown[str(q.id)] = {'correct': True, 'chosen': chosen, 'explanation': q.explanation}
        else:
            breakdown[str(q.id)] = {
                'correct': False,
                'chosen': chosen,
                'correct_index': q.correct_option_index,
                'explanation': q.explanation
            }

    percentage = (earned_marks / total_marks * 100.0) if total_marks > 0 else 0.0
    passed = earned_marks >= assessment.passing_marks

    result = AssessmentResult(
        student_id=student.id,
        assessment_id=assessment.id,
        score=earned_marks,
        max_score=total_marks,
        percentage=percentage,
        category=assessment.category,
        passed=passed,
        time_taken_seconds=time_taken,
        answers_json=json.dumps(user_answers),
        section_breakdown_json=json.dumps(breakdown)
    )
    db.session.add(result)
    student.calculate_completion()
    db.session.commit()

    return jsonify({
        'message': 'Assessment submitted successfully',
        'result': result.to_dict(),
        'correct_count': correct_count,
        'total_questions': len(questions)
    }), 201

@assessments_bp.route('/student/assessment-results', methods=['GET'])
@jwt_required()
def get_student_assessment_results():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404

    results = student.assessment_results.order_by(AssessmentResult.created_at.desc()).all()
    
    # Calculate category summary averages
    category_summary = {}
    for r in results:
        category_summary.setdefault(r.category, []).append(r.percentage)
    
    avg_summary = {k: round(sum(v)/len(v), 1) for k, v in category_summary.items()}

    return jsonify({
        'results': [r.to_dict() for r in results],
        'category_averages': avg_summary
    }), 200
