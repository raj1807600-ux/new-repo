from datetime import datetime
from backend.app.extensions import db

class AcademicRecord(db.Model):
    __tablename__ = 'academic_records'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False, unique=True)
    current_cgpa = db.Column(db.Float, nullable=False, default=0.0)
    tenth_percentage = db.Column(db.Float, nullable=False, default=0.0)
    twelfth_percentage = db.Column(db.Float, nullable=True, default=0.0)
    diploma_percentage = db.Column(db.Float, nullable=True, default=0.0)
    active_backlogs = db.Column(db.Integer, nullable=False, default=0)
    history_backlogs = db.Column(db.Integer, nullable=False, default=0)
    attendance_percentage = db.Column(db.Float, nullable=False, default=75.0)
    gap_years = db.Column(db.Integer, default=0)
    cgpa_scale = db.Column(db.Float, default=10.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'current_cgpa': round(self.current_cgpa, 2),
            'tenth_percentage': round(self.tenth_percentage, 2),
            'twelfth_percentage': round(self.twelfth_percentage, 2) if self.twelfth_percentage else None,
            'diploma_percentage': round(self.diploma_percentage, 2) if self.diploma_percentage else None,
            'active_backlogs': self.active_backlogs,
            'history_backlogs': self.history_backlogs,
            'attendance_percentage': round(self.attendance_percentage, 2),
            'gap_years': self.gap_years,
            'cgpa_scale': self.cgpa_scale,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class SemesterRecord(db.Model):
    __tablename__ = 'semester_records'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False, index=True)
    semester_number = db.Column(db.Integer, nullable=False)  # 1 to 8
    sgpa = db.Column(db.Float, nullable=False, default=0.0)
    percentage = db.Column(db.Float, nullable=True)
    credits = db.Column(db.Float, nullable=True, default=24.0)
    backlogs_in_sem = db.Column(db.Integer, default=0)
    subjects_passed = db.Column(db.Integer, default=6)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('student_id', 'semester_number', name='uix_student_semester'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'semester_number': self.semester_number,
            'sgpa': round(self.sgpa, 2),
            'percentage': round(self.percentage, 2) if self.percentage else round(self.sgpa * 9.5, 2),
            'credits': self.credits,
            'backlogs_in_sem': self.backlogs_in_sem,
            'subjects_passed': self.subjects_passed
        }
