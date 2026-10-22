from datetime import datetime
from backend.app.extensions import db

class StudentProfile(db.Model):
    __tablename__ = 'student_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    enrollment_no = db.Column(db.String(30), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    gender = db.Column(db.String(20), nullable=True)
    date_of_birth = db.Column(db.Date, nullable=True)
    address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(50), nullable=True, default='Bhopal')
    state = db.Column(db.String(50), nullable=True, default='Madhya Pradesh')
    branch = db.Column(db.String(50), nullable=False, index=True)  # CSE, IT, EC, ME, EX, CE, AI&DS
    degree = db.Column(db.String(50), nullable=False, default='B.Tech')
    current_semester = db.Column(db.Integer, nullable=False, default=7, index=True)
    passing_year = db.Column(db.Integer, nullable=False, default=2026, index=True)
    target_role = db.Column(db.String(100), nullable=True, default='Software Developer')
    bio = db.Column(db.Text, nullable=True)
    avatar_url = db.Column(db.String(255), nullable=True)
    profile_completion = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    academic_record = db.relationship('AcademicRecord', backref='student', uselist=False, cascade='all, delete-orphan')
    semester_records = db.relationship('SemesterRecord', backref='student', cascade='all, delete-orphan', lazy='dynamic', order_by='SemesterRecord.semester_number')
    student_skills = db.relationship('StudentSkill', backref='student', cascade='all, delete-orphan', lazy='dynamic')
    certifications = db.relationship('Certification', backref='student', cascade='all, delete-orphan', lazy='dynamic')
    internships = db.relationship('Internship', backref='student', cascade='all, delete-orphan', lazy='dynamic')
    projects = db.relationship('Project', backref='student', cascade='all, delete-orphan', lazy='dynamic')
    resumes = db.relationship('Resume', backref='student', cascade='all, delete-orphan', lazy='dynamic', order_by='Resume.upload_date.desc()')
    assessment_results = db.relationship('AssessmentResult', backref='student', cascade='all, delete-orphan', lazy='dynamic')
    predictions = db.relationship('Prediction', backref='student', cascade='all, delete-orphan', lazy='dynamic', order_by='Prediction.created_at.desc()')
    prediction_histories = db.relationship('PredictionHistory', backref='student', cascade='all, delete-orphan', lazy='dynamic')
    eligibility_results = db.relationship('EligibilityResult', backref='student', cascade='all, delete-orphan', lazy='dynamic')
    skill_gaps = db.relationship('SkillGap', backref='student', cascade='all, delete-orphan', lazy='dynamic')
    recommendations = db.relationship('CompanyRecommendation', backref='student', cascade='all, delete-orphan', lazy='dynamic')
    roadmap_tasks = db.relationship('RoadmapTask', backref='student', cascade='all, delete-orphan', lazy='dynamic')

    def calculate_completion(self):
        """Compute profile completion percentage dynamically."""
        score = 20  # Base personal info
        if self.phone and self.gender and self.target_role:
            score += 10
        if self.academic_record and self.academic_record.current_cgpa > 0:
            score += 25
        if self.student_skills.count() > 0:
            score += 15
        if self.projects.count() > 0 or self.internships.count() > 0:
            score += 15
        if self.assessment_results.count() > 0:
            score += 10
        if self.resumes.count() > 0:
            score += 5
        self.profile_completion = min(100.0, float(score))
        return self.profile_completion

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'email': self.user.email if self.user else None,
            'enrollment_no': self.enrollment_no,
            'full_name': self.full_name,
            'phone': self.phone,
            'gender': self.gender,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'branch': self.branch,
            'degree': self.degree,
            'current_semester': self.current_semester,
            'passing_year': self.passing_year,
            'target_role': self.target_role,
            'bio': self.bio,
            'avatar_url': self.avatar_url,
            'profile_completion': self.profile_completion,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
