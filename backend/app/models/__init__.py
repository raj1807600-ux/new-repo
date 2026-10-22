from backend.app.models.user import User
from backend.app.models.student import StudentProfile
from backend.app.models.academic import AcademicRecord, SemesterRecord
from backend.app.models.skill import Skill, StudentSkill
from backend.app.models.portfolio import Certification, Internship, Project
from backend.app.models.resume import Resume
from backend.app.models.assessment import Assessment, AssessmentQuestion, AssessmentResult
from backend.app.models.company import Company, CompanyCriteria, CompanySkill
from backend.app.models.prediction import Prediction, PredictionHistory
from backend.app.models.eligibility import EligibilityResult, CompanyRecommendation
from backend.app.models.skill_gap import SkillGap, RoadmapTask
from backend.app.models.system import Notification, AdminActivityLog

__all__ = [
    'User',
    'StudentProfile',
    'AcademicRecord',
    'SemesterRecord',
    'Skill',
    'StudentSkill',
    'Certification',
    'Internship',
    'Project',
    'Resume',
    'Assessment',
    'AssessmentQuestion',
    'AssessmentResult',
    'Company',
    'CompanyCriteria',
    'CompanySkill',
    'Prediction',
    'PredictionHistory',
    'EligibilityResult',
    'CompanyRecommendation',
    'SkillGap',
    'RoadmapTask',
    'Notification',
    'AdminActivityLog'
]
