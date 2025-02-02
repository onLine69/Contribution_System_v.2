from flask import request, jsonify, make_response
from . import transaction_history_bp
from .model import TransactionHistoryModel
from modules.models import ThisAppModel
from config import ACADEMIC_YEAR


@transaction_history_bp.route('/get-all/<string:organization_code>/<string:name>', methods=['GET'])
def getHistory(organization_code :str, name :str):
    try:
        contributions = ThisAppModel.displayContributions(organization_code, ACADEMIC_YEAR)
        request_contribution = name if name != 'default' else contributions[0]['name']

        data = {
            'contributions': contributions,
            'chosen_contribution': ThisAppModel.searchContributions(request_contribution, organization_code, ACADEMIC_YEAR)[0],
            'history': TransactionHistoryModel.getTransactionsHistory(request_contribution, ACADEMIC_YEAR)
        }       
        
        return make_response(jsonify(data), 200)
    except Exception as e:
        print("Error:", e)
        return make_response(jsonify({'message': str(e)}), 400)