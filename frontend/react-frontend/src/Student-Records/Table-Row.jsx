import { useState, useContext } from "react";
import { StudentContext } from "./Student-Records.jsx";
import StudentFormModal from "./Student-Form-Modal.jsx";
import { deleteStudent } from "./requests/deleteStudent.js";

export default function TableRow({ student, count }) {
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {setStudents, _} = useContext(StudentContext);

  // Function to show the modal
  const showModal = () => {
    setIsModalOpen(true); // Set state to open the modal
  };

  // Function to hide the modal
  const hideModal = () => {
    setIsModalOpen(false); // Set state to close the modal
  };

  return (
    <>
    <tr>
      <td title={count}>{count}</td>
      <td title={student.full_name}>{student.full_name}</td>
      <td title={student.id_number}>{student.id_number}</td>
      <td title={student.gender}>{student.gender}</td>
      <td title={student.year_level}>{student.year_level}</td>
      <td title={student.program_code}>{student.program_code}</td>
      <td title={student.notes}>{student.notes}</td>
      <td>
        <button type="button" className={"edit-student"} onClick={showModal}>Edit</button>
      </td>
      <td>
        <button type="button" className={"delete-student"} onClick={async () => {deleteStudent(student.id_number, setStudents)}}>Delete</button>
      </td>
    </tr>
    {/* Render the modal if it's open */}
    {isModalOpen && <StudentFormModal purpose={"Edit"} student={student} isOpen={isModalOpen} closeModal={hideModal} />}
    </>
  );
}
