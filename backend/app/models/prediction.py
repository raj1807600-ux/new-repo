from datetime import datetime
import json
from backend.app.extensions import db

class Prediction(db.Model):
    __tablename__ = 'predictions'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    placement_probability = db.Column(db.Float, nullable=False)  # 0 to 100
    readiness_score = db.Column(db.Float, nullable=False)  # 0 to 100
    readiness_level = db.Column(db.String(50), nullable=False)  # 'Needs Improvement', 'Developing', 'Moderate', 'Strong', 'Excellent'
    confidence_score = db.Column(db.Float, nullable=False, default=85.0)  # 0 to 100
    best_fit_role = db.Column(db.String(100), nullable=False)
    alternative_roles_json = db.Column(db.Text, nullable=True)  # JSON array of alternative roles
    
    # Granular composite readiness components (0-100 each)
    academic_score = db.Column(db.Float, default=0.0)
    technical_score = db.Column(db.Float, default=0.0)
    coding_score = db.Column(db.Float, default=0.0)
    communication_score = db.Column(db.Float, default=0.0)
    projects_score = db.Column(db.Float, default=0.0)
    internships_score = db.Column(db.Float, default=0.0)
    certifications_score = db.Column(db.Float, default=0.0)
    resume_score = db.Column(db.Float, default=0.0)
    
    # Academic trajectory snapshot
    projected_final_cgpa = db.Column(db.Float, default=0.0)
    cgpa_trend_slope = db.Column(db.Float, default=0.0)
    
    # Model meta
    model_version = db.Column(db.String(50), default='Ensemble-v1.0 (RF+GBM)')
    is_demo = db.Column(db.Boolean, default=True)
    disclaimer = db.Column(db.String(255), default='Predictions are advisory estimates based on student data and do not guarantee placement.')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'placement_probability': round(self.placement_probability, 1),
            'readiness_score': round(self.readiness_score, 1),
            'readiness_level': self.readiness_level,
            'confidence_score': round(self.confidence_score, 1),
            'best_fit_role': self.best_fit_role,
            'alternative_roles': json.loads(self.alternative_roles_json) if self.alternative_roles_json else [],
            'subscores': {
                'academic': round(self.academic_score, 1),
                'technical': round(self.technical_score, 1),
                'coding': round(self.coding_score, 1),
                'communication': round(self.communication_score, 1),
                'projects': round(self.projects_score, 1),
                'internships': round(self.internships_score, 1),
                'certifications': round(self.certifications_score, 1),
                'resume': round(self.resume_score, 1)
            },
            'projected_final_cgpa': round(self.projected_final_cgpa, 2),
            'model_version': self.model_version,
            'is_demo': self.is_demo,
            'disclaimer': self.disclaimer,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class PredictionHistory(db.Model):
    __tablename__ = 'prediction_history'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    prediction_id = db.Column(db.Integer, db.ForeignKey('predictions.id', ondelete='SET NULL'), nullable=True)
    placement_probability = db.Column(db.Float, nullable=False)
    readiness_score = db.Column(db.Float, nullable=False)
    cgpa = db.Column(db.Float, default=0.0)
    month_label = db.Column(db.String(20), nullable=True)  # e.g., 'Jul 2025', 'Aug 2025'
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'placement_probability': round(self.placement_probability, 1),
            'readiness_score': round(self.readiness_score, 1),
            'cgpa': round(self.cgpa, 2),
            'month_label': self.month_label or self.recorded_at.strftime('%b %Y'),
            'recorded_at': self.recorded_at.isoformat() if self.recorded_at else None
        }
