from flask import Blueprint

verify_payments_bp = Blueprint('verifyPayments', __name__)

from . import routes, model