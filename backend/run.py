import os
import sys

# Ensure root workspace directory is in python path
ROOT_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.app import create_app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    print(f"Starting Oriental Placement Intelligence Backend on port {port}...")
    app.run(host='127.0.0.1', port=port, debug=debug)
