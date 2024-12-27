import pandas as pd
import os
from io import BytesIO

class ThisApp:
    @staticmethod
    def getStudents(cursor):
        try:
            query = """ SELECT * FROM `students`
                        ORDER BY `program_code` ASC, 
                            `year_level` ASC, 
                            `full_name` ASC;
                        """
            cursor.execute(query)
            return cursor.fetchall()
        except Exception as e:
            cursor.rollback()
            print(f"An error occurred: {e}")
            raise e
        finally:
            cursor.close()

    @staticmethod
    def adds(cursor, file):
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
            
            # Create a cursor object
            with cursor:
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

                # Commit the transaction after all inserts
                cursor.connection.commit()
        except Exception as e:
            print(f"Error: {e}")
            cursor.connection.rollback()
            raise e
