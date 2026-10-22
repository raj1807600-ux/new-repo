from datetime import datetime
import json
from backend.app.extensions import db

class Resume(db.Model):
    __tablename__ = 'resumes'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_size_kb = db.Column(db.Float, default=0.0)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    ats_score = db.Column(db.Integer, default=70)  # 0 to 100
    ats_breakdown_json = db.Column(db.Text, nullable=True)  # JSON for sections, formatting, keywords
    detected_skills_json = db.Column(db.Text, nullable=True)  # JSON list of detected skills
    recommendations_json = db.Column(db.Text, nullable=True)  # JSON list of improvement tips
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'filename': self.filename,
            'file_size_kb': round(self.file_size_kb, 1),
            'upload_date': self.upload_date.isoformat() if self.upload_date else None,
            'ats_score': self.ats_score,
            'ats_breakdown': json.loads(self.ats_breakdown_json) if self.ats_breakdown_json else {},
            'detected_skills': json.loads(self.detected_skills_json) if self.detected_skills_json else [],
            'recommendations': json.loads(self.recommendations_json) if self.recommendations_json else [],
            'is_active': self.is_active
        }
