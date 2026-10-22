import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'database', 'oriental_placement.db')

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'oriental-placement-intelligence-secret-key-2026')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'oriental-jwt-secure-signing-key-9992')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    # Database: Use MySQL if MYSQL_URL/DATABASE_URL specified, else local SQLite
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '')
    MYSQL_DB = os.environ.get('MYSQL_DB', 'oriental_placement')
    
    # Priority: Explicit DATABASE_URL -> MySQL config if configured -> SQLite fallback
    DATABASE_URL = os.environ.get('DATABASE_URL')
    if not DATABASE_URL:
        if os.environ.get('USE_MYSQL', 'false').lower() == 'true':
            DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"
        else:
            DATABASE_URL = f"sqlite:///{DB_PATH}"

    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
    } if 'mysql' in DATABASE_URL else {}

    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads', 'resumes')
    REPORTS_FOLDER = os.path.join(BASE_DIR, 'reports')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

    # Institution branding metadata
    INSTITUTION_NAME = "Oriental Group of Institutes / Oriental Institute of Science and Technology (OIST), Bhopal"
    INSTITUTION_SHORT = "OIST Bhopal"
    INSTITUTION_LOCATION = "Opp. Patel Nagar, Raisen Road, Bhopal, MP - 462021"
