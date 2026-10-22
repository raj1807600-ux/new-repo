from datetime import datetime
import json
from backend.app.extensions import db

class EligibilityResult(db.Model):
    __tablename__ = 'eligibility_results'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False, index=True)
    status = db.Column(db.String(20), nullable=False)  # 'Eligible' (Green), 'Almost Eligible' (Yellow), 'Not Eligible' (Red)
    match_percentage = db.Column(db.Float, nullable=False, default=0.0)  # 0 to 100
    cgpa_eligible = db.Column(db.Boolean, default=True)
    backlog_eligible = db.Column(db.Boolean, default=True)
    branch_eligible = db.Column(db.Boolean, default=True)
    tenth_twelfth_eligible = db.Column(db.Boolean, default=True)
    skills_match_percentage = db.Column(db.Float, default=100.0)
    matched_skills_json = db.Column(db.Text, nullable=True)
    missing_skills_json = db.Column(db.Text, nullable=True)
    reasons_json = db.Column(db.Text, nullable=True)  # List of reasons or blocking points
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('student_id', 'company_id', name='uix_student_company_eligibility'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'company_id': self.company_id,
            'company_name': self.company.name if self.company else '',
            'job_role': self.company.job_role if self.company else '',
            'ctc_formatted': self.company.to_dict()['ctc_formatted'] if self.company else '',
            'tier': self.company.tier if self.company else '',
            'logo_url': self.company.logo_url if self.company else '',
            'status': self.status,
            'match_percentage': round(self.match_percentage, 1),
            'cgpa_eligible': self.cgpa_eligible,
            'backlog_eligible': self.backlog_eligible,
            'branch_eligible': self.branch_eligible,
            'tenth_twelfth_eligible': self.tenth_twelfth_eligible,
            'skills_match_percentage': round(self.skills_match_percentage, 1),
            'matched_skills': json.loads(self.matched_skills_json) if self.matched_skills_json else [],
            'missing_skills': json.loads(self.missing_skills_json) if self.missing_skills_json else [],
            'reasons': json.loads(self.reasons_json) if self.reasons_json else []
        }

class CompanyRecommendation(db.Model):
    __tablename__ = 'company_recommendations'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False, index=True)
    rank = db.Column(db.Integer, default=1)
    match_score = db.Column(db.Float, nullable=False, default=0.0)
    recommendation_reason = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('student_id', 'company_id', name='uix_student_company_recommendation'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'company_id': self.company_id,
            'company': self.company.to_dict() if self.company else None,
            'rank': self.rank,
            'match_score': round(self.match_score, 1),
            'recommendation_reason': self.recommendation_reason
        }
