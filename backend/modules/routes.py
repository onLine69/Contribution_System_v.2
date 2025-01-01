from flask import jsonify, make_response
from . import app
from .models import ThisAppModel

@app.route('/program-codes/<string:organization_code>', methods=["GET"])
def programCodes(organization_code :str):
    try:
        program_codes = ThisAppModel.getProgramCodes(organization_code)
        return make_response(jsonify(program_codes), 200)
    except Exception as e:
        print(e)
        return make_response(jsonify({'message': 'MySQL error'}), 400) 