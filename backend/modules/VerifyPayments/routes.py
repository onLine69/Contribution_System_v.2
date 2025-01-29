from flask import request, jsonify, make_response
from . import verify_payments_bp
from .model import VerifyPaymentsModel
from modules.models import ThisAppModel
from config import ACADEMIC_YEAR


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
        print(req)

        # contribution_value = ThisAppModel.searchContributions(request_contribution, organization_code, ACADEMIC_YEAR)[0]

        # data = {
        #     'title': "Payment Receipt",
        #     'contribution_name': form.contribution_name.data,
        #     'block_rep': form.block_rep.data,
        #     'verification_date': str(datetime.datetime.now()).split(" ")[0],
        #     'program_code': form.program_code.data,
        #     'year_level': form.year_level.data,
        #     'total_amount': form.total_amount.data,
        #     'student_ids': request.form.getlist('student_id'),
        #     'student_names': request.form.getlist('student_name'),
        #     'notes': request.form.getlist('transaction_message'),
        #     'academic_year': ACADEMIC_YEAR
        # }
        # data['count'] = len(data['student_ids'])
        # verifyTransactions(data['contribution_name'], ACADEMIC_YEAR, contribution_value, data['student_ids'], data['notes'])
        return make_response(jsonify({'message': "Payments Verified Sucessfully."}), 201)
    except Exception as e:
        print("Error:", e)
        return make_response(jsonify({'message': str(e)}), 400)