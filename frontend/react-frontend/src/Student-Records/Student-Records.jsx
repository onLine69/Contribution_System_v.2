import { useState, useEffect, createContext } from "react";
import "./Student-Records.css";
import TableHeader from "./Table-Header.jsx";
import TableRow from "./Table-Row.jsx";
import StudentFormModal from "./Student-Form-Modal.jsx";

import fetchStudents from "./requests/fetchStudents.js";
import bulkAddStudents from "./requests/bulkAddStudents.js";
import fetchProgramCodes from "../fetchProgramCodes.js";

export const StudentContext = createContext();

export default function StudentRecords() {
  const addSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M4.45611 1.91832L6.97006 1.91832L6.97006 5.01212M4.45611 1.91832L5.02974 1.38013L7.5437 1.38013L7.54369 4.47393M4.45611 1.91832L4.4561 4.47393M6.97006 5.01212L10.0639 5.01212M6.97006 5.01212L7.54369 4.47393M10.0639 5.01212L10.0639 7.52607M10.0639 5.01212L10.6375 4.47393M10.0639 7.52607L7.54369 7.52607M10.0639 7.52607L10.6375 6.98788L10.6375 4.47393M6.97006 10.6199L4.45611 10.6199L4.45611 7.52607L1.36231 7.52607L1.3623 5.01212M6.97006 10.6199L6.97006 7.52607L7.54369 7.52607M6.97006 10.6199L7.5437 10.0817L7.54369 7.52607M1.3623 5.01212L4.4561 5.01212L4.4561 4.47393M1.3623 5.01212L1.93594 4.47393L4.4561 4.47393M7.54369 4.47393L10.6375 4.47393"
        stroke="white"
        stroke-opacity="0.5"
        stroke-width="1.2"
      />
    </svg>
  );

  const [columnSearch, setColumnSearch] = useState("full_name");
  const [paramSearch, setParamSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [programCodes, setProgramCodes] = useState([]);

  useEffect(() => {
    fetchStudents(setStudents, setError);
    fetchProgramCodes(setProgramCodes);
  }, []);

  const operationArea = (
    <div
      style={{
        width: "100%",
        backgroundColor: "#F4F5FF",
        position: "sticky",
        top: "100px",
        zIndex: "1000",
      }}
    >
      <div id="student-records-actions">
        <div id="search-student-form">
          <select
            name="column-search"
            id="column-search"
            value={columnSearch}
            onChange={(e) => setColumnSearch(e.target.value)}
          >
            <option value="full_name">Name</option>
            <option value="id_number">ID Number</option>
            <option value="gender">Gender</option>
            <option value="year_level">Year Level</option>
            <option value="program_code">Program Code</option>
          </select>
          <input
            type="text"
            id="param-search"
            placeholder="Search Student Info Here..."
            value={paramSearch}
            onChange={(e) => setParamSearch(e.target.value)}
          />
        </div>

        <button
          type="button"
          id="add-student"
          onClick={() => setIsAddModalOpen(true)}
        >
          {addSVG} Add
        </button>

        <label htmlFor="file-upload" id="bulk-add-students">
          Import List
        </label>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={(e) => {
            bulkAddStudents(e, fetchStudents);
          }}
        />
      </div>
    </div>
  );

  const filteredStudents = students
    .filter((student) => student[columnSearch].includes(paramSearch)) // Filter first
    .sort((a, b) => {
      // Sorting priority: program_code, then year_level, then full_name
      if (a.program_code < b.program_code) return -1;
      if (a.program_code > b.program_code) return 1;
      if (a.year_level < b.year_level) return -1;
      if (a.year_level > b.year_level) return 1;
      if (a.full_name < b.full_name) return -1;
      if (a.full_name > b.full_name) return 1;
      return 0;
    });

  return (
    <>
      {/* Use StudentContext.Provider to pass the setStudents function */}
      <StudentContext.Provider value={{setStudents, programCodes}}>
        {operationArea}
        {isAddModalOpen && (
          <StudentFormModal
            purpose={"Add"}
            isOpen={isAddModalOpen}
            closeModal={() => setIsAddModalOpen(false)}
          />
        )}
        <br />
        <table>
          <TableHeader filteredStudentslength={filteredStudents.length} />
          <tbody>
            {error ? (
              <tr key="error-row">
                <td colSpan="8"> Error: {error.message}. Check the backend if working. </td>
              </tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <TableRow
                  key={student.id_number}
                  student={student}
                  count={index + 1}
                />
              ))
            ) : (
              <tr key="error-row">
                {students.length > 0 ? (
                  <td colSpan="8"> No student matches the search parameters. &#123; '{columnSearch}' has "{paramSearch}" &#125; </td>
                ) : (
                  <td colSpan="8">
                    <i>No Student</i>
                  </td>
                )}
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="8">
                <i>End of Table</i>
              </td>
            </tr>
          </tfoot>
        </table>
      </StudentContext.Provider>
    </>
  );
}
