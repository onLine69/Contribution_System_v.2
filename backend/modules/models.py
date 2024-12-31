import pymysql

from config import DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST

class DBConnection:
    @staticmethod
    def get_connection():
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USERNAME,
            password=DB_PASSWORD,
            database=DB_NAME,
            cursorclass=pymysql.cursors.DictCursor
        )

        return connection