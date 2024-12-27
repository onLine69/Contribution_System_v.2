from flask import Flask, make_response, jsonify, request
from flask_cors import CORS
import pymysql


from modules.models import ThisApp


from config import SECRET_KEY, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def start_app():
    app.config['SECRET_KEY'] = SECRET_KEY
    print("Starting app")
    return app

def get_connection():
    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USERNAME,
        password=DB_PASSWORD,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )
    
    return connection

@app.route('/students', methods=["GET"])
def index():
    try:
        #fetch the parameters
        cursor = get_connection().cursor()
        students = ThisApp.getStudents(cursor)
        return make_response(jsonify(students), 200)
    except Exception as e:
        print(e)
        return make_response(jsonify({'message': 'MySQL error'}), 400)
    
@app.route('/bulk-add', methods=["POST"])
def bulkAdd():
    try:
        # Get the uploaded file
        file = request.files['file-upload']
        print(f"Received file: {file.filename}")

        # Get the cursor from the database connection
        cursor = get_connection().cursor()

        # Call the adds function to insert the data
        ThisApp.adds(cursor, file)

        # Return a success message
        return make_response(jsonify({'message': 'Bulk add successful'}), 200)
    except Exception as e:
        print(f"Error: {e}")
        return make_response(jsonify({'message': str(e)}), 400)