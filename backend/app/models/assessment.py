from datetime import datetime
import json
from backend.app.extensions import db

class Assessment(db.Model):
    __tablename__ = 'assessments'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(50), nullable=False, index=True)  # 'aptitude', 'technical', 'coding', 'communication', 'mock_interview'
    sub_category = db.Column(db.String(100), nullable=True)  # e.g., 'DSA', 'DBMS', 'Quantitative', 'Logical', 'Verbal'
    description = db.Column(db.Text, nullable=True)
    duration_minutes = db.Column(db.Integer, default=30)
    total_marks = db.Column(db.Integer, default=100)
    passing_marks = db.Column(db.Integer, default=40)
    weight_percentage = db.Column(db.Float, default=20.0)  # Configurable assessment weight in readiness
    difficulty = db.Column(db.String(20), default='Medium')  # 'Easy', 'Medium', 'Hard'
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    questions = db.relationship('AssessmentQuestion', backref='assessment', cascade='all, delete-orphan', lazy='dynamic')
    results = db.relationship('AssessmentResult', backref='assessment', cascade='all, delete-orphan', lazy='dynamic')

    def to_dict(self, include_questions_count=True):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'sub_category': self.sub_category,
            'description': self.description,
            'duration_minutes': self.duration_minutes,
            'total_marks': self.total_marks,
            'passing_marks': self.passing_marks,
            'weight_percentage': self.weight_percentage,
            'difficulty': self.difficulty,
            'questions_count': self.questions.count() if include_questions_count else 0,
            'is_active': self.is_active
        }

class AssessmentQuestion(db.Model):
    __tablename__ = 'assessment_questions'

    id = db.Column(db.Integer, primary_key=True)
    assessment_id = db.Column(db.Integer, db.ForeignKey('assessments.id', ondelete='CASCADE'), nullable=False, index=True)
    question_text = db.Column(db.Text, nullable=False)
    options_json = db.Column(db.Text, nullable=False)  # JSON list of strings ["Option A", "Option B", ...]
    correct_option_index = db.Column(db.Integer, nullable=False)  # 0, 1, 2, 3
    explanation = db.Column(db.Text, nullable=True)
    marks = db.Column(db.Integer, default=5)
    difficulty = db.Column(db.String(20), default='Medium')

    def to_dict(self, include_correct=False):
        data = {
            'id': self.id,
            'assessment_id': self.assessment_id,
            'question_text': self.question_text,
            'options': json.loads(self.options_json) if self.options_json else [],
            'marks': self.marks,
            'difficulty': self.difficulty
        }
        if include_correct:
            data['correct_option_index'] = self.correct_option_index
            data['explanation'] = self.explanation
        return data

class AssessmentResult(db.Model):
    __tablename__ = 'assessment_results'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    assessment_id = db.Column(db.Integer, db.ForeignKey('assessments.id', ondelete='CASCADE'), nullable=False, index=True)
    score = db.Column(db.Float, nullable=False)
    max_score = db.Column(db.Float, nullable=False)
    percentage = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    passed = db.Column(db.Boolean, default=True)
    time_taken_seconds = db.Column(db.Integer, default=0)
    answers_json = db.Column(db.Text, nullable=True)  # User submitted answers
    section_breakdown_json = db.Column(db.Text, nullable=True)  # Sub-topic performance
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'assessment_id': self.assessment_id,
            'assessment_title': self.assessment.title if self.assessment else 'Assessment',
            'score': round(self.score, 1),
            'max_score': round(self.max_score, 1),
            'percentage': round(self.percentage, 1),
            'category': self.category,
            'passed': self.passed,
            'time_taken_seconds': self.time_taken_seconds,
            'section_breakdown': json.loads(self.section_breakdown_json) if self.section_breakdown_json else {},
            'date_taken': self.created_at.isoformat() if self.created_at else None
        }
