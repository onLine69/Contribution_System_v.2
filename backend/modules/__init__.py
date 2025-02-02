from flask import Flask
from flask_cors import CORS
from config import SECRET_KEY


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

from modules.StudentRecords import student_records_bp
from modules.PaymentRecords import payment_records_bp
from modules.VerifyPayments import verify_payments_bp
from modules.TransactionHistory import transaction_history_bp

def start_app():
    app.config['SECRET_KEY'] = SECRET_KEY
    
    app.register_blueprint(student_records_bp, url_prefix="/student-records")
    app.register_blueprint(payment_records_bp, url_prefix="/payment-records")
    app.register_blueprint(verify_payments_bp, url_prefix="/verify-payments")
    app.register_blueprint(transaction_history_bp, url_prefix="/transaction-history")
    
    return app


from . import routes, models