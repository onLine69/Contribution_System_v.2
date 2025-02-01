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
    
class ThisAppModel:
    @staticmethod
    def getProgramCodes(organization_code :str):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                fetch_query = "SELECT `code` FROM `programs` WHERE `organization_code` = %s ORDER BY `code` ASC;"
                cursor.execute(fetch_query, (organization_code,))
                return cursor.fetchall()
            except Exception as e:
                connection.rollback()  # Rollback in case of error
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed
    
    @staticmethod
    def displayContributions(organization_code :str, academic_year :str):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                search_query = """
                    SELECT `name`, `amount`, `academic_year` 
                    FROM `contributions` 
                    WHERE `collecting_org_code` = %s 
                    AND `academic_year` = %s 
                    ORDER BY `name` ASC;
                """
                
                cursor.execute(search_query, (organization_code, academic_year))
                return cursor.fetchall()
            except Exception as e:
                connection.rollback()  # Rollback in case of error
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed

    @staticmethod
    def searchContributions(contribution_name :str, organization_code :str, academic_year :str):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:    
            try:
                search_query = f"""
                    SELECT `name`, `amount`, `academic_year` 
                    FROM `contributions` 
                    WHERE `collecting_org_code` = %s 
                    AND `academic_year` = %s 
                    AND `name` = %s
                    ORDER BY `name` ASC;
                """
                cursor.execute(search_query, (organization_code, academic_year, contribution_name))
                return cursor.fetchall()
            except Exception as e:
                connection.rollback()  # Rollback in case of error
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed

    @staticmethod
    def getBlockReps(organization_code :str):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:    
            try:
                search_query = f"""
                    SELECT `s`.`full_name`, `s`.`year_level`, `s`.`program_code` 
                    FROM `blockreps` AS `b`
                    LEFT JOIN `students` AS `s`
                    ON `b`.id_number = `s`.id_number
                    WHERE `s`.`program_code` 
                    IN (
                        SELECT `program_code` 
                        FROM `programs`
                        WHERE `organization_code` = %s
                    )
                    ORDER BY `program_code` ASC, `year_level` ASC;
                """
                cursor.execute(search_query, (organization_code, ))
                return cursor.fetchall()
            except Exception as e:
                connection.rollback()  # Rollback in case of error
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed