from datetime import datetime
import json
from backend.app.extensions import db

class SkillGap(db.Model):
    __tablename__ = 'skill_gaps'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    target_role = db.Column(db.String(100), nullable=False)
    student_skills_json = db.Column(db.Text, nullable=True)  # Student's existing skills
    required_skills_json = db.Column(db.Text, nullable=True)  # Industry requirements for role
    missing_skills_json = db.Column(db.Text, nullable=True)  # Missing key skills
    primary_gap_area = db.Column(db.String(100), nullable=True)  # e.g., 'Backend Development', 'DSA / Algorithmic Thinking'
    match_percentage = db.Column(db.Float, default=0.0)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'target_role': self.target_role,
            'student_skills': json.loads(self.student_skills_json) if self.student_skills_json else [],
            'required_skills': json.loads(self.required_skills_json) if self.required_skills_json else [],
            'missing_skills': json.loads(self.missing_skills_json) if self.missing_skills_json else [],
            'primary_gap_area': self.primary_gap_area,
            'match_percentage': round(self.match_percentage, 1),
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class RoadmapTask(db.Model):
    __tablename__ = 'roadmap_tasks'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    week_number = db.Column(db.Integer, nullable=False)  # 1 to 6
    title = db.Column(db.String(150), nullable=False)
    topic = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    recommended_resources_json = db.Column(db.Text, nullable=True)  # Links/resources
    is_completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'week_number': self.week_number,
            'title': self.title,
            'topic': self.topic,
            'description': self.description,
            'recommended_resources': json.loads(self.recommended_resources_json) if self.recommended_resources_json else [],
            'is_completed': self.is_completed,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
