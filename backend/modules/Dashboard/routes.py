from flask import request, jsonify, make_response
from . import dashboard_bp
from .model import DashboardModel
from modules.models import ThisAppModel
from config import ACADEMIC_YEAR


@dashboard_bp.route('/get-stat/<string:organization_code>/<string:program_code>/<string:year>/<string:month>', methods=['GET'])
def getStat(organization_code :str, program_code :str, year :str, month :str):
    try:
        # Fetch the contributions
        contributions = ThisAppModel.displayContributions(organization_code, ACADEMIC_YEAR)
        # Set the names of the contributions
        data = {
            'names': {
                'first': contributions[0]['name'],
                'second': contributions[1]['name']
            }
        }
        # Fetch how many students are paid in each contribution
        data['paid'] = {
            'first': DashboardModel.fetchPaid(data['names']['first'], month, program_code, year),
            'second': DashboardModel.fetchPaid(data['names']['second'], month, program_code, year),
        }
        # Fetch how many students have not yet paid in each contribution
        data['unpaid'] = {
            'first': DashboardModel.fetchUnpaid(program_code, data['paid']['first']),
            'second': DashboardModel.fetchUnpaid(program_code, data['paid']['second']),
        }
        return make_response(jsonify(data), 200)
    except Exception as e:
        print("Error:", e)
        return make_response(jsonify({'message': str(e)}), 400)
    
@dashboard_bp.route('/edit-contributions', methods=["PUT"])
def editContributions():
    try:
        # Get the request
        contributions = request.get_json()
        # Get their original names
        original_contributions = ThisAppModel.displayContributions(contributions["organization_code"], ACADEMIC_YEAR)
        original_names = [original_contributions[0]['name'], original_contributions[1]['name']]
        # Proceed with edit
        DashboardModel.editContributions(contributions, original_names)
        return make_response(jsonify({'message': 'Contributions Updated Sucessfully'}), 201)
    except Exception as e:
        print(f"Error: {e}")
        return make_response(jsonify({'message': str(e)}), 400)
    
@dashboard_bp.route('/get-list/<string:organization_code>/<string:list_type>', methods=["GET"])
def getList(organization_code :str, list_type :str):
    try:
        # Fetch the program codes
        programs = ThisAppModel.getProgramCodes(organization_code)
        # Set up necessary static data
        year_levels = ['1', '2', '3', '4']
        data = {
            'list-type': f"{list_type} Students List",
            'programs': programs,
            'year_levels': year_levels
        }
        # Fetch every student in each Program and Year based on the list requested
        for program in programs:
            for year_level in year_levels:
                key = f"{program['code']}-{year_level}"
                match list_type:
                    case "All":     # All students
                        data[key] = DashboardModel.fetchAllList(program['code'], year_level)
                    case "Paid":    # Paid students
                        data[key] = DashboardModel.fetchPaidList(program['code'], year_level)
                    case "Unpaid":  # Unpaid students
                        data[key] = DashboardModel.fetchUnpaidList(program['code'], year_level)
                    case _:
                        return make_response(jsonify({'message': 'Invalid type.'}), 400)
        return make_response(jsonify(data), 200)
    except Exception as e:
        print(f"Error: {e}")
        return make_response(jsonify({'message': str(e)}), 400)