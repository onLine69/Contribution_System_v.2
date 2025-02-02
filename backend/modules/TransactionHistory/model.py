from modules.models import DBConnection

class TransactionHistoryModel:
    @staticmethod
    def getTransactionsHistory(contribution_name :str, academic_year :str):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                fetch_query = """
                    SELECT `t`.`id`, `t`.`datetime`, `s`.`id_number`, `s`.`full_name`, `s`.`year_level`, `s`.`program_code`, `t`.`payment_mode`, `t`.`status`, `t`.`transaction_message`
                    FROM `transactions` AS `t` LEFT JOIN `students` AS `s` ON `t`.`payer_id` = `s`.`id_number`
                    WHERE `t`.`contribution_name` = %s AND `t`.`contribution_ay` = %s
                    ORDER BY `t`.`id` ASC, `s`.`program_code` ASC, `s`.`year_level` ASC, `s`.`full_name` ASC;
                """

                cursor.execute(fetch_query, (contribution_name, academic_year))
                unformatted = cursor.fetchall()

                for u in unformatted:
                    u['datetime'] = str(u['datetime'])
                return unformatted
            except Exception as e:
                connection.rollback()
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed 