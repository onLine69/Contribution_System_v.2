from flask import request, jsonify, make_response
from . import payment_records_bp
from .model import PaymentRecordsModel
from modules.models import ThisAppModel
from config import ACADEMIC_YEAR


@payment_records_bp.route('/get-records', methods=["GET"])
def getPayments():
    try:
        organization_code = "CCS-EC"
        contributions = ThisAppModel.displayContributions(organization_code, ACADEMIC_YEAR)
        request_contribution = contributions[0]['name'] #request.args.get('contribution-names', contributions[0][0], type=str)
        data = {
            'tab_name': "Payment Records",
            'contributions': contributions,
            'chosen_contribution': ThisAppModel.searchContributions(request_contribution, organization_code, ACADEMIC_YEAR)[0],
            'display_program_code': None, #request.args.get('program-code', None, type=str),
            'display_year_level': None, #request.args.get('year-level', None, type=str),
            'display_selected_status': 'All', #request.args.get('display-status', 'All', type=str),
            'program_codes': ThisAppModel.getProgramCodes(organization_code)
        }
        
        
        if data['display_selected_status'] == "All":
            paid_students = PaymentRecordsModel.fetchPaid(request_contribution, data['display_year_level'], data['display_program_code'], ACADEMIC_YEAR)
            data['stat'] = {
                'paid': {
                    'data': paid_students
                },
                'unpaid': {
                    'data': PaymentRecordsModel.fetchUnpaid(data['display_year_level'], data['display_program_code'], paid_students)
                }
            }
        print("Info:", data)
        data['students'] = PaymentRecordsModel.getPaymentRecords(data['chosen_contribution']['name'], 
                                    ACADEMIC_YEAR, 
                                    data['display_selected_status'], 
                                    data['display_program_code'], 
                                    data['display_year_level'])
        
        
        data['count'] = len(data['students'])
        return make_response(jsonify(data), 200)
    except Exception as e:
        print("Error:", e)
        return make_response(jsonify({'message': str(e)}), 400)