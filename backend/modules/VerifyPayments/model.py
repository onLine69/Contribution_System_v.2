from modules.models import DBConnection

class VerifyPaymentsModel:
    @staticmethod
    def getVerifyRecords(contribution_name, academic_year):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                fetch_query = """
                    SELECT `t`.`id`, `t`.`datetime`, `s`.`id_number`, `s`.`full_name`, `t`.`payment_mode`, `t`.`transaction_message`
                    FROM `transactions` AS `t`
                    LEFT JOIN `students` AS `s` ON `t`.`payer_id` = `s`.`id_number`
                    WHERE `t`.`status` = "Pending" 
                    AND `t`.`contribution_name` = %s 
                    AND `t`.`contribution_ay` = %s 
                    AND `s`.`id_number` NOT IN (
                        SELECT `st`.`id_number`
                        FROM `transactions` AS `tr`
                        LEFT JOIN `students` AS `st` ON `tr`.`payer_id` = `st`.`id_number`
                        WHERE (`tr`.`status` = "Accepted") 
                        AND `tr`.`contribution_name` = %s 
                        AND `tr`.`contribution_ay` = %s
                    )
                """
                fetch_params = [contribution_name, academic_year, contribution_name, academic_year]

                fetch_query += " ORDER BY `t`.`id` ASC, `s`.`program_code` ASC, `s`.`year_level` ASC, `s`.`full_name` ASC;"

                cursor.execute(fetch_query, tuple(fetch_params))
                return cursor.fetchall()
            except Exception as e:
                connection.rollback()
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed 

    @staticmethod
    def verifyTransactions(name, acad_year, amount, payer_ids, transaction_messages):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                transact_query =   """
                                INSERT INTO `transactions` (`contribution_name`, `contribution_ay`, `payer_id`, `payment_mode`, `amount`, `transaction_message`, `status`)
                                VALUES (%s, %s, %s, "Cash", %s, %s, "Accepted");
                                """
                check_query = """
                    SELECT COUNT(`payer_id`)
                    FROM `transactions` 
                    WHERE  `payer_id` = %s AND `contribution_name` = %s AND `contribution_ay` = %s AND `status` = "Accepted"
                """ 
                
                for n in range(0, len(payer_ids)):
                    cursor.execute(check_query, (payer_ids[n], name, acad_year))
                    recorded = cursor.fetchone()['COUNT(`payer_id`)']
                    if recorded == 0:
                        cursor.execute(transact_query, (name, acad_year, payer_ids[n], amount, transaction_messages[n]))
                        connection.commit()
                
            except Exception as e:
                connection.rollback()  # Rollback in case of error
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed