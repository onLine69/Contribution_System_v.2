from flask import request, jsonify, make_response
from . import payment_records_bp
from .model import PaymentRecordsModel
from modules.models import ThisAppModel
from config import ACADEMIC_YEAR


@payment_records_bp.route('/get-records/<string:organization_code>/<string:name>', methods=["GET"])
def getPayments(organization_code :str, name :str = None):
    try:
        contributions = ThisAppModel.displayContributions(organization_code, ACADEMIC_YEAR)
        request_contribution = name if name != 'default' else contributions[0]['name']

        data = {
            'contributions': contributions,
            'chosen_contribution': ThisAppModel.searchContributions(request_contribution, organization_code, ACADEMIC_YEAR)[0],
            'program_codes': ThisAppModel.getProgramCodes(organization_code)
        }

        paid_students = PaymentRecordsModel.fetchPaid(request_contribution, ACADEMIC_YEAR)
        data['stat'] = {
            'paid': paid_students,
            'unpaid': PaymentRecordsModel.fetchUnpaid(paid_students, organization_code)
        }
        data['students'] = PaymentRecordsModel.getPaymentRecords(data['chosen_contribution']['name'], 
                                    ACADEMIC_YEAR, organization_code)
        
        
        data['count'] = len(data['students'])
        return make_response(jsonify(data), 200)
    except Exception as e:
        print("Error:", e)
        return make_response(jsonify({'message': str(e)}), 400)
    

@payment_records_bp.route('/transact-payments', methods=["POST"])
def transactPayments():
    try:
        req = request.get_json()
        print(req)

        return make_response(jsonify({'message': "Payments Transacted Sucessfully"}), 201)
    except Exception as e:
        print("Error:", e)
        return make_response(jsonify({'message': str(e)}), 400)