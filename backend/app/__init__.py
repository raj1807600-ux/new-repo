import os
from flask import Flask, jsonify
from backend.app.config import Config
from backend.app.extensions import db, jwt, cors
from backend.app.routes import register_routes

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Create storage folders
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['REPORTS_FOLDER'], exist_ok=True)

    # Register all API routes
    register_routes(app)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'system': 'Oriental Placement Intelligence & Prediction System',
            'institution': 'Oriental Group of Institutes / OIST Bhopal',
            'database': 'Connected'
        }), 200

    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return jsonify({'error': 'Missing or invalid authorization token'}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired. Please log in again.'}), 401

    return app
