import os
import joblib
import numpy as np

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

class ModelLoader:
    _instance = None
    _scaler = None
    _placement_model = None
    _role_model = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
            cls._instance.load_models()
        return cls._instance

    def load_models(self):
        scaler_path = os.path.join(MODELS_DIR, 'scaler.joblib')
        placement_model_path = os.path.join(MODELS_DIR, 'placement_ensemble.joblib')
        role_model_path = os.path.join(MODELS_DIR, 'role_classifier.joblib')

        if os.path.exists(scaler_path) and os.path.exists(placement_model_path) and os.path.exists(role_model_path):
            try:
                self._scaler = joblib.load(scaler_path)
                self._placement_model = joblib.load(placement_model_path)
                self._role_model = joblib.load(role_model_path)
                print("ML models loaded successfully from disk.")
            except Exception as e:
                print("Failed to load serialized models, will train or use calibrated fallback:", e)
        else:
            print("Models not found on disk yet. Running automatic training...")
            try:
                from backend.ml.train import train_and_save_models
                train_and_save_models()
                self._scaler = joblib.load(scaler_path)
                self._placement_model = joblib.load(placement_model_path)
                self._role_model = joblib.load(role_model_path)
            except Exception as e:
                print("Automatic training exception:", e)

    @property
    def scaler(self):
        return self._scaler

    @property
    def placement_model(self):
        return self._placement_model

    @property
    def role_model(self):
        return self._role_model
