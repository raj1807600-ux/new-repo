from datetime import datetime
from backend.app.extensions import db

class Certification(db.Model):
    __tablename__ = 'certifications'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    title = db.Column(db.String(150), nullable=False)
    issuing_organization = db.Column(db.String(150), nullable=False)
    issue_date = db.Column(db.Date, nullable=True)
    expiry_date = db.Column(db.Date, nullable=True)
    credential_id = db.Column(db.String(100), nullable=True)
    credential_url = db.Column(db.String(255), nullable=True)
    skills_covered = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'title': self.title,
            'issuing_organization': self.issuing_organization,
            'issue_date': self.issue_date.isoformat() if self.issue_date else None,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'credential_id': self.credential_id,
            'credential_url': self.credential_url,
            'skills_covered': self.skills_covered
        }

class Internship(db.Model):
    __tablename__ = 'internships'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    company_name = db.Column(db.String(150), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=True, default='Bhopal / Remote')
    duration_months = db.Column(db.Integer, nullable=False, default=3)
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    technologies = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    certificate_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'company_name': self.company_name,
            'role': self.role,
            'location': self.location,
            'duration_months': self.duration_months,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'technologies': self.technologies,
            'description': self.description,
            'certificate_url': self.certificate_url
        }

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    title = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(50), nullable=True, default='Web Application')  # 'Web App', 'AI/ML', 'Mobile App', 'Cloud/DevOps', 'Core CS/Systems'
    technologies = db.Column(db.String(255), nullable=False)
    github_url = db.Column(db.String(255), nullable=True)
    live_url = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    team_size = db.Column(db.Integer, default=1)  # 1 for individual, 2+ for team
    complexity = db.Column(db.String(20), default='Intermediate')  # 'Basic', 'Intermediate', 'Advanced'
    complexity_score = db.Column(db.Integer, default=70)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'title': self.title,
            'category': self.category,
            'technologies': self.technologies,
            'github_url': self.github_url,
            'live_url': self.live_url,
            'description': self.description,
            'team_size': self.team_size,
            'complexity': self.complexity,
            'complexity_score': self.complexity_score
        }
