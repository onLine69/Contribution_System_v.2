import { useState, useEffect, createContext } from "react";
import "./Student-Records.css";

export const StudentContext = createContext();

import TableHeader from "./Table-Header.jsx";
import TableRow from "./Table-Row.jsx";
import StudentFormModal from "./Student-Form-Modal.jsx";

export default function StudentRecords() {
  const addSVG =  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M4.45611 1.91832L6.97006 1.91832L6.97006 5.01212M4.45611 1.91832L5.02974 1.38013L7.5437 1.38013L7.54369 4.47393M4.45611 1.91832L4.4561 4.47393M6.97006 5.01212L10.0639 5.01212M6.97006 5.01212L7.54369 4.47393M10.0639 5.01212L10.0639 7.52607M10.0639 5.01212L10.6375 4.47393M10.0639 7.52607L7.54369 7.52607M10.0639 7.52607L10.6375 6.98788L10.6375 4.47393M6.97006 10.6199L4.45611 10.6199L4.45611 7.52607L1.36231 7.52607L1.3623 5.01212M6.97006 10.6199L6.97006 7.52607L7.54369 7.52607M6.97006 10.6199L7.5437 10.0817L7.54369 7.52607M1.3623 5.01212L4.4561 5.01212L4.4561 4.47393M1.3623 5.01212L1.93594 4.47393L4.4561 4.47393M7.54369 4.47393L10.6375 4.47393" stroke="white" stroke-opacity="0.5" stroke-width="1.2"/>
                  </svg>;

  const [columnSearch, setColumnSearch] = useState("full_name");
  const [paramSearch, setParamSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchStudents = async () => {
    try {
        const response = await fetch(
            'http://127.0.0.1:5000/students',
            {
                method: 'GET'
            }
        );
        const text = await response.text();
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = JSON.parse(text);
        const updatedData = data.map((element, index) => ({ ...element, number: index }));
        setStudents(updatedData);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setError(error);
    }
  }; 

  useEffect(() => {
    fetchStudents();
  }, []);

  const bulkAddStudents = async (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0]; // Get the selected file

    if (file) {
      // Prepare the FormData object
      const formData = new FormData();
      formData.append("file-upload", file); // Append the file to FormData

      try {
        // Send the request using fetch
        const response = await fetch("http://127.0.0.1:5000/bulk-add", {
          method: "POST",
          body: formData, // Attach the FormData object to the request
        });

        // Handle the response
        if (!response.ok) {
          const promiseResult = await response.json();
          throw new Error(`Processing failed: ${promiseResult.message}`);
        }

        const result = await response.json();
        alert("File uploaded successfully!");
        
        fetchStudents();
      } catch (error) {
        const errorMessage = error.message;
        alert(errorMessage);
      }
    };
  };
  
  const operationArea = <div style={{ width: "100%", backgroundColor: "#F4F5FF", position: "sticky", top: "100px", zIndex: "1000" }}>
                          <div id="student-records-actions">
                            <div id="search-student-form">
                              <select name="column-search" id="column-search" value={columnSearch} onChange={(e) => setColumnSearch(e.target.value)}>
                                <option value="full_name">Name</option>
                                <option value="id_number">ID Number</option>
                                <option value="gender">Gender</option>
                                <option value="year_level">Year Level</option>
                                <option value="program_code">Program Code</option>
                              </select>

                              <input type="text" 
                              id="param-search" 
                              placeholder="Search Student Info Here..." 
                              value={paramSearch} 
                              onChange={(e) => setParamSearch(e.target.value)}/>
                            </div>

                            <button 
                            type="button" 
                            id="add-student" onClick={() => {setIsAddModalOpen(true)}}>{ addSVG } Add</button>

                            <label htmlFor="file-upload" id="bulk-add-students">Import List</label>
                            <input id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                            onChange={bulkAddStudents}/>
                          </div>
                        </div>;
  console.log(students);
  const filteredStudents = students
                          .filter(student => student[columnSearch].includes(paramSearch)) // Filter first
                          .sort((a, b) => {
                            // Sorting priority: program_code, then year_level, then full_name
                            if (a.program_code < b.program_code) return -1; // Sort by program_code
                            if (a.program_code > b.program_code) return 1;
                            if (a.year_level < b.year_level) return -1; // If program_code is equal, sort by year_level
                            if (a.year_level > b.year_level) return 1;
                            if (a.full_name < b.full_name) return -1; // If program_code and year_level are equal, sort by full_name
                            if (a.full_name > b.full_name) return 1;
                            return 0; // If all are equal, keep the original order
                          });

  return (
    <>
      { operationArea }
      <StudentContext.Provider value={setStudents}>
      {isAddModalOpen && <StudentFormModal purpose={"Add"} isOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} />}
      </StudentContext.Provider>
      <br />
      <table>
        <TableHeader filteredStudentslength={filteredStudents.length} />
        <StudentContext.Provider value={setStudents}>
        <tbody>
          {error ? (
            <tr key="error-row">
              <td colSpan="8">Error: {error.message}. Check the backend if working.</td>
            </tr>
          ) : (
            filteredStudents.map((student, index) => (
              <TableRow key={student.id_number} student={student} count={index + 1} />
            ))
          )}
        </tbody>
        </StudentContext.Provider>
        <tfoot>
          <tr>
            <td colspan="8"><i>End of Table</i></td>
          </tr>
        </tfoot>
      </table>

    </>
  );
}