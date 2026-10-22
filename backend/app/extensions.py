from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import bcrypt

db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()

def hash_password(password: str) -> str:
    """Hash password securely using bcrypt."""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def check_password(password: str, hashed_password: str) -> bool:
    """Verify password match with hashed string."""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False
