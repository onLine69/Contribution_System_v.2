from modules.models import DBConnection

class PaymentRecordsModel:
    @staticmethod
    def getPaymentRecords(item_name, academic_year, student_status, program_code, year_level):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                # Get the students
                fetch_students_query = """
                    SELECT `full_name`, `id_number` 
                    FROM `students` 
                    WHERE 1=1
                """
                fetch_students_params = []

                if program_code:
                    fetch_students_query += " AND `program_code` = %s"
                    fetch_students_params.append(program_code)

                if year_level:
                    fetch_students_query += " AND `year_level` = %s"
                    fetch_students_params.append(year_level)

                fetch_students_query += " ORDER BY `program_code` ASC, `year_level` ASC, `full_name` ASC;"
                
                cursor.execute(fetch_students_query, tuple(fetch_students_params))
                student_list = cursor.fetchall()

                # Get the price/amount of the item
                get_item_amount_query = """
                    SELECT `amount` 
                    FROM `contributions` 
                    WHERE `name` = %s AND `academic_year` = %s;
                """
                cursor.execute(get_item_amount_query, (item_name, academic_year))

                item_amount_result = cursor.fetchone() 
                item_amount = item_amount_result['amount'] if item_amount_result else 0  # Default to 0 if not found

                # Initialize an empty list for students with their balance and status
                updated_students = []
                get_balance_query = """
                    SELECT `amount` 
                    FROM `transactions` 
                    WHERE `payer_id` = %s AND `contribution_name` = %s AND `contribution_ay` = %s AND `status` = %s;
                """
                
                for student in student_list:
                    # Initialize balance to the item's amount
                    balance = item_amount

                    # Check if the student is already paid
                    student_id = student['id_number']  # Get the student's ID
                    cursor.execute(get_balance_query, (student_id, item_name, academic_year, "Accepted"))
                    payment_amount = cursor.fetchone()

                    # Determine the payment status
                    if payment_amount:  # If already paid or partially paid
                        balance -= payment_amount['amount']  # Subtract the payment amount from the balance
                        status = "Paid" if balance == 0 else "Unpaid"  # Determine status based on balance
                    else:
                        # Check for pending transactions
                        cursor.execute("""
                            SELECT `status` 
                            FROM `transactions` 
                            WHERE `payer_id` = %s AND `contribution_name` = %s AND `contribution_ay` = %s AND `status` = %s 
                            ORDER BY `datetime` DESC;
                        """, (student_id, item_name, academic_year, "Pending"))
                        fetched = cursor.fetchone()
                        # Determine status based on fetched result
                        if fetched:
                            status = "Pending" if fetched['status'] == "Pending" else "Unpaid"
                        else:
                            status = "Unpaid"  # Default to "Unpaid" if no transactions are found

                    # Append the balance and status to the student tuple based on the desired status
                    if student_status == "All" or status == student_status:
                        student['balance'] = balance
                        student['status'] = status
                        updated_students.append(student)

                return updated_students
            except Exception as e:
                print(e)
                connection.rollback()  # Rollback in case of error
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed
    
    @staticmethod
    def fetchPaid(contribution_name :str, year_level :str, program_code :str, academic_year :str):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                years = academic_year.split("-")
                fetch_query =   """
                    SELECT COUNT(*) AS paid FROM `transactions` AS `t` LEFT JOIN `students` AS `s` 
                    ON `t`.`payer_id` = `s`.`id_number`
                    WHERE `t`.`contribution_name` = %s
                    AND `t`.`contribution_ay` = %s
                    AND (YEAR(`t`.`datetime`) >= %s AND YEAR(`t`.`datetime`) <= %s) 
                    AND `t`.`status` = "Accepted"
                """
                
                fetch_params = [contribution_name, academic_year, int(years[0]), int(years[1])]

                if year_level:
                    fetch_query += " AND `s`.`year_level` = %s"
                    fetch_params.append(year_level)

                if program_code:
                    fetch_query += " AND `s`.`program_code` = %s"
                    fetch_params.append(program_code)

                fetch_query += ";"

                cursor.execute(fetch_query, tuple(fetch_params))
                
                return cursor.fetchone()['paid']
            except Exception as e:
                connection.rollback()  # Rollback in case of error
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed

    @staticmethod
    def fetchUnpaid(year_level :str, program_code :str, paid_count : int):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                fetch_query =   """
                    SELECT COUNT(*) AS paid FROM `students` WHERE 1 = 1
                """
                
                fetch_params =[]

                if year_level:
                    fetch_query += " AND `year_level` = %s"
                    fetch_params.append(year_level)
                
                if program_code:
                    fetch_query += " AND `program_code` = %s"
                    fetch_params.append(program_code)
                
                fetch_query += ";"

                if len(fetch_params) > 0:
                    cursor.execute(fetch_query, tuple(fetch_params))
                else:
                    cursor.execute(fetch_query)
                
                return cursor.fetchone()['paid'] - paid_count
            except Exception as e:
                connection.rollback()  # Rollback in case of error
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed

    @staticmethod
    def createTransaction(name, acad_year, amount, payer_ids, transaction_messages):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                transact_query =   """
                    INSERT INTO `transactions` (`contribution_name`, `contribution_ay`, `payer_id`, `payment_mode`, `amount`, `transaction_message`, `status`)
                    VALUES (%s, %s, %s, "Cash", %s, %s, "Pending");
                """
                
                for n in range(0, len(payer_ids)):
                    cursor.execute(transact_query, (name, acad_year, payer_ids[n], amount, transaction_messages[n]))
                    connection.commit()
                
            except Exception as e:
                connection.rollback()  # Rollback in case of error
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed