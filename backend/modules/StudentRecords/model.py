import pandas as pd
from io import BytesIO
from modules.models import DBConnection

class StudentsRecordsModel:
    @staticmethod
    def getStudents():
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                query = """ SELECT * FROM `students`
                            ORDER BY `program_code` ASC, 
                                `year_level` ASC, 
                                `full_name` ASC;
                            """
                cursor.execute(query)
                return cursor.fetchall()
            except Exception as e:
                connection.rollback()
                print(f"An error occurred: {e}")
                raise e
            finally:
                cursor.close()

    @staticmethod
    def add(student):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                insert_statement =  """
                        INSERT INTO `students` (`full_name`, `id_number`, `gender`, `year_level`, `program_code`, `note`)
                        VALUE (%s, %s, %s, %s, %s, %s) 
                    """
                cursor.execute(insert_statement, student)
                connection.commit()
            except connection.Error as e:
                connection.rollback()  # Rollback in case of error
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed

    @staticmethod
    def update(student):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                update_statement =  """
                        UPDATE `students`
                        SET `full_name` = %s, `id_number` = %s, `gender` = %s, `year_level` = %s, `program_code` = %s, `note` = %s
                        WHERE `id_number` = %s;
                    """
                cursor.execute(update_statement, student)
                connection.commit()
            except connection.Error as e:
                connection.rollback()  # Rollback in case of error
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed

    @staticmethod
    def delete(student_id):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                delete_statement =  """
                        DELETE FROM `students` 
                        WHERE `id_number` = %s;
                    """
                cursor.execute(delete_statement, (student_id,))
                connection.commit()
            except connection.Error as e:
                connection.rollback()  # Rollback in case of error
                raise e
            finally:
                cursor.close()  # Ensure the cursor is closed

    @staticmethod
    def adds(file):
        connection = DBConnection.get_connection()
        with connection.cursor() as cursor:
            try:
                # Check if the file is a CSV or Excel file
                if file.filename.endswith('.xls') or file.filename.endswith('.xlsx'):
                    # Read Excel file directly from the file object
                    df = pd.read_excel(BytesIO(file.read()), sheet_name=0)
                elif file.filename.endswith('.csv'):
                    # Read CSV file directly from the file object
                    df = pd.read_csv(BytesIO(file.read()))
                else:
                    raise ValueError("Unsupported file format. Please provide a .xls, .xlsx, or .csv file.")
                
                insert_statement = """
                        INSERT INTO `students` (`full_name`, `id_number`, `gender`, `year_level`, `program_code`)
                        VALUES (%s, %s, %s, %s, %s)
                    """

                # Loop through each row in the DataFrame
                for index, row in df.iterrows():
                    student = (
                        row['full_name'],
                        row['id_number'],
                        row['gender'],
                        row['year_level'],
                        row['program_code']
                    )

                    # Execute the insert statement
                    cursor.execute(insert_statement, student)
                    print(student)
                    # Commit the transaction after all inserts
                    connection.commit()
            except Exception as e:
                print(f"Error: {e}")
                connection.rollback()
                raise e
            finally:
                cursor.close()
