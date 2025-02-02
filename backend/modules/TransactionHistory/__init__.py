from flask import Blueprint

transaction_history_bp = Blueprint('transactionHistory', __name__)

from . import routes, model