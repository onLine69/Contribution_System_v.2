from flask import request, jsonify, make_response
from . import verify_payments_bp
from .model import VerifyPaymentsModel
from modules.models import ThisAppModel
from config import ACADEMIC_YEAR

import json


@verify_payments_bp.route('/get-verify/<string:organization_code>/<string:name>', methods=["GET"])
def getVerify(organization_code :str, name :str):
    try:
        contributions = ThisAppModel.displayContributions(organization_code, ACADEMIC_YEAR)
        request_contribution = name if name != 'default' else contributions[0]['name']
    
        data = {
            'contributions': contributions,
            'chosen_contribution': ThisAppModel.searchContributions(request_contribution, organization_code, ACADEMIC_YEAR)[0]
        }

        data['verifications'] = VerifyPaymentsModel.getVerifyRecords(data['chosen_contribution']['name'], ACADEMIC_YEAR)
        print(data)
        return make_response(jsonify(data), 200)
    except Exception as e:
        print("Error:", e)
        return make_response(jsonify({'message': str(e)}), 400)
    
@verify_payments_bp.route('/verify', methods=["POST"])
def verify():
    try:
        req = request.get_json()
        json_str = json.dumps(req, indent=2)
        print(json_str)

        VerifyPaymentsModel.verifyTransactions(req["name"], ACADEMIC_YEAR, req["amount"], req['payments'])
        return make_response(jsonify({'message': "Payments Verified Sucessfully."}), 201)
    except Exception as e:
        print("Error:", e)
        return make_response(jsonify({'message': str(e)}), 400)