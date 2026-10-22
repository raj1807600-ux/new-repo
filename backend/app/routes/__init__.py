from backend.app.routes.auth import auth_bp
from backend.app.routes.student import student_bp
from backend.app.routes.academics import academics_bp
from backend.app.routes.skills import skills_bp
from backend.app.routes.resumes import resumes_bp
from backend.app.routes.assessments import assessments_bp
from backend.app.routes.prediction import prediction_bp
from backend.app.routes.companies import companies_bp
from backend.app.routes.skill_gap import skill_gap_bp
from backend.app.routes.reports import reports_bp
from backend.app.routes.admin import admin_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(academics_bp)
    app.register_blueprint(skills_bp)
    app.register_blueprint(resumes_bp)
    app.register_blueprint(assessments_bp)
    app.register_blueprint(prediction_bp)
    app.register_blueprint(companies_bp)
    app.register_blueprint(skill_gap_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(admin_bp)
