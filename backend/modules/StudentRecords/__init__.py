from flask import Blueprint

student_records_bp = Blueprint('studentRecords', __name__)

from . import routes, model