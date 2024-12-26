import { useState, useEffect } from "react";
import "./Student-Records.css";

function StudentRecords() {
  const addSVG =  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M4.45611 1.91832L6.97006 1.91832L6.97006 5.01212M4.45611 1.91832L5.02974 1.38013L7.5437 1.38013L7.54369 4.47393M4.45611 1.91832L4.4561 4.47393M6.97006 5.01212L10.0639 5.01212M6.97006 5.01212L7.54369 4.47393M10.0639 5.01212L10.0639 7.52607M10.0639 5.01212L10.6375 4.47393M10.0639 7.52607L7.54369 7.52607M10.0639 7.52607L10.6375 6.98788L10.6375 4.47393M6.97006 10.6199L4.45611 10.6199L4.45611 7.52607L1.36231 7.52607L1.3623 5.01212M6.97006 10.6199L6.97006 7.52607L7.54369 7.52607M6.97006 10.6199L7.5437 10.0817L7.54369 7.52607M1.3623 5.01212L4.4561 5.01212L4.4561 4.47393M1.3623 5.01212L1.93594 4.47393L4.4561 4.47393M7.54369 4.47393L10.6375 4.47393" stroke="white" stroke-opacity="0.5" stroke-width="1.2"/>
                  </svg>;

  const [columnSearch, setColumnSearch] = useState(0);
  const [paramSearch, setParamSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
          const response = await fetch(
              `http://127.0.0.1:5000/students/search?column-search=${columnSearch}&param-search=${paramSearch}`,
              {
                  method: 'GET'
              }
          );
          const text = await response.text();
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = JSON.parse(text);
          console.log(data);
          setStudents(data);
      } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
          setError(error);
      }
    }; 
    fetchStudents();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const filteredStudents = students.filter(student => student[columnSearch].includes(paramSearch));

  const tableHeaders =  <thead>
                          <th scope="col"></th>
                          <th scope="col">Name</th>
                          <th scope="col">ID Number</th>
                          <th scope="col">Gender</th>
                          <th scope="col">Year</th>
                          <th scope="col">Program</th>
                          <th scope="col">Note</th>
                          <th scope="col" colspan="2">Number of Students = { filteredStudents.length }</th>
                        </thead>;

  return (
    <>
      <div style={{ width: "100%", backgroundColor: "#F4F5FF", position: "sticky", top: "100px", zIndex: "1000" }}>
        <div id="student-records-actions">
          <div id="search-student-form">
            <select name="column-search" id="column-search" value={columnSearch} onChange={(e) => setColumnSearch(e.target.value)}>
              <option value={ 0 }>Name</option>
              <option value={ 1 }>ID Number</option>
              <option value={ 2 }>Gender</option>
              <option value={ 3 }>Year Level</option>
              <option value={ 4 }>Program Code</option>
            </select>

            <input type="text" id="param-search" placeholder="Search Student Info Here..." value={paramSearch} onChange={(e) => setParamSearch(e.target.value)}/>
          </div>

          <button type="button" id="add-student">{ addSVG } Add</button>
          <label htmlFor="file-upload" id="bulk-add-students">Import List</label>
          <input id="file-upload" name="file-upload" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        </div>
      </div>
      <br />
      <table>
        { tableHeaders }
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={index}>
              <td title={ index + 1 }>{ index + 1 }</td>
              <td title={ student[0] }>{ student[0] }</td>
              <td title={ student[1] }>{ student[1] }</td>
              <td title={ student[2] }>{ student[2] }</td>
              <td title={ student[3] }>{ student[3] }</td>
              <td title={ student[4] }>{ student[4] }</td>
              <td title={ student[5] }>{ student[5] }</td>
              <td>
                <button type="button" className={"edit-student"}>Edit</button>
              </td>
              <td>
                <button type="button" className={"delete-student"}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="8"><i>End of Table</i></td>
          </tr>
        </tfoot>
      </table>

    </>
  );
}

export default StudentRecords;