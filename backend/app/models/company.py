from datetime import datetime
import json
from backend.app.extensions import db

class Company(db.Model):
    __tablename__ = 'companies'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False, unique=True, index=True)
    logo_url = db.Column(db.String(255), nullable=True)
    industry = db.Column(db.String(100), default='IT / Software Services')
    website = db.Column(db.String(255), nullable=True)
    tier = db.Column(db.String(30), default='Tier 1')  # 'Tier 1', 'Tier 2', 'Tier 3', 'Dream', 'Super Dream'
    job_role = db.Column(db.String(150), nullable=False)
    job_location = db.Column(db.String(150), default='Pan India / Bhopal / Pune / Bangalore')
    ctc_min_lpa = db.Column(db.Float, nullable=False, default=4.0)
    ctc_max_lpa = db.Column(db.Float, nullable=False, default=7.0)
    drive_status = db.Column(db.String(30), default='Upcoming')  # 'Upcoming', 'Ongoing', 'Completed', 'Active'
    drive_date = db.Column(db.Date, nullable=True)
    registration_deadline = db.Column(db.Date, nullable=True)
    description = db.Column(db.Text, nullable=True)
    selection_process = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    criteria = db.relationship('CompanyCriteria', backref='company', uselist=False, cascade='all, delete-orphan')
    required_skills = db.relationship('CompanySkill', backref='company', cascade='all, delete-orphan', lazy='dynamic')
    eligibility_results = db.relationship('EligibilityResult', backref='company', cascade='all, delete-orphan', lazy='dynamic')
    recommendations = db.relationship('CompanyRecommendation', backref='company', cascade='all, delete-orphan', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'logo_url': self.logo_url,
            'industry': self.industry,
            'website': self.website,
            'tier': self.tier,
            'job_role': self.job_role,
            'job_location': self.job_location,
            'ctc_min_lpa': self.ctc_min_lpa,
            'ctc_max_lpa': self.ctc_max_lpa,
            'ctc_formatted': f"₹{self.ctc_min_lpa} - {self.ctc_max_lpa} LPA" if self.ctc_min_lpa != self.ctc_max_lpa else f"₹{self.ctc_min_lpa} LPA",
            'drive_status': self.drive_status,
            'drive_date': self.drive_date.isoformat() if self.drive_date else None,
            'registration_deadline': self.registration_deadline.isoformat() if self.registration_deadline else None,
            'description': self.description,
            'selection_process': self.selection_process,
            'criteria': self.criteria.to_dict() if self.criteria else None,
            'required_skills': [s.to_dict() for s in self.required_skills],
            'is_active': self.is_active
        }

class CompanyCriteria(db.Model):
    __tablename__ = 'company_criteria'

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False, unique=True)
    min_cgpa = db.Column(db.Float, default=6.0)
    min_tenth_percentage = db.Column(db.Float, default=60.0)
    min_twelfth_percentage = db.Column(db.Float, default=60.0)
    max_active_backlogs = db.Column(db.Integer, default=0)
    allow_backlog_history = db.Column(db.Boolean, default=True)
    min_attendance = db.Column(db.Float, default=70.0)
    eligible_branches_json = db.Column(db.Text, default='["CSE", "IT", "EC", "ME", "EX", "CE", "AIML"]')
    min_assessment_score = db.Column(db.Float, default=50.0)
    gender_preference = db.Column(db.String(20), default='All')  # 'All', 'Female Only'

    def to_dict(self):
        return {
            'id': self.id,
            'company_id': self.company_id,
            'min_cgpa': self.min_cgpa,
            'min_tenth_percentage': self.min_tenth_percentage,
            'min_twelfth_percentage': self.min_twelfth_percentage,
            'max_active_backlogs': self.max_active_backlogs,
            'allow_backlog_history': self.allow_backlog_history,
            'min_attendance': self.min_attendance,
            'eligible_branches': json.loads(self.eligible_branches_json) if self.eligible_branches_json else [],
            'min_assessment_score': self.min_assessment_score,
            'gender_preference': self.gender_preference
        }

class CompanySkill(db.Model):
    __tablename__ = 'company_skills'

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False, index=True)
    skill_name = db.Column(db.String(100), nullable=False)
    importance = db.Column(db.String(20), default='Mandatory')  # 'Mandatory', 'Preferred', 'Bonus'
    min_proficiency = db.Column(db.String(20), default='Intermediate')

    def to_dict(self):
        return {
            'id': self.id,
            'company_id': self.company_id,
            'skill_name': self.skill_name,
            'importance': self.importance,
            'min_proficiency': self.min_proficiency
        }
