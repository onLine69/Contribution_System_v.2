from modules.models import DBConnection
from config import ACADEMIC_YEAR

class DashboardModel:
    @staticmethod
    def fetchPaid(contribution_name :str, month :int, program_code :str, year :str):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                year_levels = ['1', '2', '3', '4']
                count = []
                chosen_year = int(year)
                fetch_query =   """
                    SELECT COUNT(*) FROM `transactions` AS `t` LEFT JOIN `students` AS `s` 
                    ON `t`.`payer_id` = `s`.`id_number`
                    WHERE `t`.`contribution_name` = %s
                    AND `t`.`contribution_ay` = %s
                    AND (YEAR(`t`.`datetime`) < %s OR (YEAR(`t`.`datetime`) = %s AND MONTH(`t`.`datetime`) <= %s)) 
                    AND `t`.`status` = "Accepted" 
                    AND `s`.`program_code` = %s 
                    AND `s`.`year_level` = %s;
                """
                for year_level in year_levels:
                    cursor.execute(fetch_query, (contribution_name, ACADEMIC_YEAR, chosen_year, chosen_year, month, program_code, year_level))
                    counter = cursor.fetchall()
                    count.append(counter[0]['COUNT(*)'])

                return count
            except Exception as e:
                connection.rollback()
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed 

    @staticmethod
    def fetchUnpaid(program_code :str, paid_count : int):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                year_levels = ['1', '2', '3', '4']
                count = []
                print(paid_count)
                fetch_query =   """
                    SELECT COUNT(*) FROM `students` WHERE `program_code` = %s AND `year_level` = %s;
                """
                for s in range(0, 4):
                    cursor.execute(fetch_query, (program_code, year_levels[s]))
                    count.append(cursor.fetchall()[0]['COUNT(*)'] - paid_count[s])
                
                return count
            except Exception as e:
                connection.rollback()
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed 

    @staticmethod
    def editContributions(new_data, original_names):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                alter_query = """
                    UPDATE `contributions`
                    SET `name` = %s, `amount` = %s
                    WHERE `name` = %s AND `collecting_org_code` = %s;
                """
                # Update both contributions
                cursor.execute(alter_query, (new_data['f_name'], new_data['f_amount'], original_names[0], new_data['organization_code']))
                connection.commit()
                cursor.execute(alter_query, (new_data['s_name'], new_data['s_amount'], original_names[1], new_data['organization_code']))
                connection.commit()
            except Exception as e:
                connection.rollback()
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed 
    
    @staticmethod
    def fetchPaidList(program_code :str, year_level :str):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                fetch_statement =  """
                    SELECT `s`.`id_number`, `s`.`full_name`
                    FROM `transactions` AS `t` LEFT JOIN `students` AS `s` ON `t`.`payer_id` = `s`.`id_number`
                    WHERE `t`.`status` = "Accepted"
                    AND `program_code` = %s AND `year_level` = %s
                    ORDER BY `s`.`full_name`;
                """
                cursor.execute(fetch_statement, (program_code, year_level))
                students = cursor.fetchall()
                return students
            except Exception as e:
                connection.rollback()
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed 

    @staticmethod
    def fetchUnpaidList(program_code :str, year_level :str):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                fetch_statement =  """
                    SELECT `s`.`id_number`, `s`.`full_name`
                    FROM `students` AS `s`
                    LEFT JOIN `transactions` AS `t` ON `s`.`id_number` = `t`.`payer_id` AND `t`.`status` = "Accepted"
                    WHERE `t`.`payer_id` IS NULL AND `program_code` = %s AND `year_level` = %s
                    ORDER BY `s`.`full_name`;
                """
                cursor.execute(fetch_statement, (program_code, year_level))
                return cursor.fetchall()
            except Exception as e:
                connection.rollback()
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed 
    
    @staticmethod
    def fetchAllList(program_code :str, year_level :str):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                fetch_statement =  """
                    SELECT `id_number`, `full_name`
                    FROM `students`
                    WHERE `program_code` = %s AND `year_level` = %s
                    ORDER BY `full_name`;
                """
                cursor.execute(fetch_statement, (program_code, year_level))
                return cursor.fetchall()
            except Exception as e:
                connection.rollback()
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed 