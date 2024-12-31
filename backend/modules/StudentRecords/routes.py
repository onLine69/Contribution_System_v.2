from flask import make_response, jsonify, request
from . import student_records_bp
from .model import StudentsRecordsModel

@student_records_bp.route('/get-all', methods=["GET"])
def index():
    try:
        #fetch the parameters
        students = StudentsRecordsModel.getStudents()
        return make_response(jsonify(students), 200)
    except Exception as e:
        print(e)
        return make_response(jsonify({'message': 'MySQL error'}), 400)
    

@student_records_bp.route('/program-codes/<string:organization_code>', methods=["GET"])
def programCodes(organization_code :str):
    try:
        program_codes = StudentsRecordsModel.getProgramCodes(organization_code)
        return make_response(jsonify(program_codes), 200)
    except Exception as e:
        print(e)
        return make_response(jsonify({'message': 'MySQL error'}), 400) 
    
@student_records_bp.route('/bulk-add', methods=["POST"])
def bulkAdd():
    try:
        # Get the uploaded file
        file = request.files['file-upload']
        print(file.filename)
        # Call the adds function to insert the data
        StudentsRecordsModel.adds(file)

        # Return a success message
        return make_response(jsonify({'message': 'Bulk add successful'}), 200)
    except Exception as e:
        print(f"Error: {e}")
        return make_response(jsonify({'message': str(e)}), 400)
    

@student_records_bp.route('/add', methods=["POST"])
def addStudent():
    try:
        req = request.get_json()
        print(req)
        StudentsRecordsModel.add((req['full_name'], req['id_number'], req['gender'], 
                                  req['year_level'], req['program_code'], req['notes']))
        
        return make_response(jsonify({'message': 'Add Success'}), 200)
    except Exception as e:
        print(e)
        return make_response(jsonify({'message': str(e)}), 400)
    

@student_records_bp.route('/update', methods=["PUT"])
def updateStudent():
    try:
        req = request.get_json()
        print(req)
        StudentsRecordsModel.update((req['full_name'], req['id_number'], req['gender'], req['year_level'], 
                                     req['program_code'], req['notes'], req['original_id']))
        
        return make_response(jsonify({'message': 'Update Success'}), 200)
    except Exception as e:
        print(e)
        return make_response(jsonify({'message': str(e)}), 400)
    

@student_records_bp.route('/delete', methods=["DELETE"])
def deleteStudent():
    try:
        req = request.get_json()
        print(req)
        StudentsRecordsModel.delete(req['id_number'])
        return make_response(jsonify({'message': 'Delete Success'}), 200)
    except Exception as e:
        print(e)
        return make_response(jsonify({'message': str(e)}), 400)