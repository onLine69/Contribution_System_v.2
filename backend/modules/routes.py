from flask import jsonify, make_response
from . import app
from .models import ThisAppModel
from config import ACADEMIC_YEAR

@app.route('/program-codes/<string:organization_code>', methods=["GET"])
def programCodes(organization_code :str):
    try:
        program_codes = ThisAppModel.getProgramCodes(organization_code)
        return make_response(jsonify(program_codes), 200)
    except Exception as e:
        print(e)
        return make_response(jsonify({'message': 'MySQL error'}), 400)
    
@app.route('/contributions/<string:organization_code>', methods=["GET"])
def contributions(organization_code :str):
    try:
        contributions = ThisAppModel.displayContributions(organization_code)
        return make_response(jsonify(contributions), 200)
    except Exception as e:
        print(e)
        return make_response(jsonify({'message': 'MySQL error'}), 400)
    
@app.route('/blockreps/<string:organization_code>', methods=["GET"])
def getBlockReps(organization_code :str):
    try:
        block_reps = ThisAppModel.getBlockReps(organization_code)
        return make_response(jsonify(block_reps), 200)
    except Exception as e:
        print(e)
        return make_response(jsonify({'message': 'MySQL error'}), 400)
    
@app.route('/academic-year', methods=["GET"])
def getAcademicYear():
    try:
        return make_response(jsonify({'academic_year': ACADEMIC_YEAR}), 200)
    except Exception as e:
        print(e)
        return make_response(jsonify({'message': 'Error Academic Year'}), 400)