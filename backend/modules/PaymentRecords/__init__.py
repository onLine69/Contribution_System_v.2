from flask import Blueprint

payment_records_bp = Blueprint('paymentRecords', __name__)

from . import routes, model