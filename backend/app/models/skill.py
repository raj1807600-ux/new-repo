from datetime import datetime
from backend.app.extensions import db

class Skill(db.Model):
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    category = db.Column(db.String(50), nullable=False)  # 'languages', 'frontend', 'backend', 'core_cs', 'database', 'cloud_devops', 'soft_skills', 'ai_ml'
    description = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description
        }

class StudentSkill(db.Model):
    __tablename__ = 'student_skills'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id', ondelete='CASCADE'), nullable=False, index=True)
    proficiency = db.Column(db.String(20), default='Intermediate')  # 'Beginner', 'Intermediate', 'Advanced', 'Expert'
    proficiency_score = db.Column(db.Integer, default=50)  # 0 to 100
    experience_months = db.Column(db.Integer, default=6)
    is_primary = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    skill = db.relationship('Skill', backref='student_associations')

    __table_args__ = (
        db.UniqueConstraint('student_id', 'skill_id', name='uix_student_skill'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'skill_id': self.skill_id,
            'skill_name': self.skill.name if self.skill else '',
            'category': self.skill.category if self.skill else '',
            'proficiency': self.proficiency,
            'proficiency_score': self.proficiency_score,
            'experience_months': self.experience_months,
            'is_primary': self.is_primary
        }
