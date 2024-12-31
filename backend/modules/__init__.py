from flask import Flask
from flask_cors import CORS
from config import SECRET_KEY


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

from modules.StudentRecords import student_records_bp

def start_app():
    app.config['SECRET_KEY'] = SECRET_KEY
    
    app.register_blueprint(student_records_bp, url_prefix="/student-records")

    return app