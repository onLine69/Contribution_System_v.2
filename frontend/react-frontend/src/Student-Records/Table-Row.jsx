import { useState, useContext } from "react";
import { StudentContext } from "./Student-Records.jsx";
import StudentFormModal from "./Student-Form-Modal.jsx";
import { deleteStudent } from "./requests/deleteStudent.js";

export default function TableRow({ student, count }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setStudents, _ } = useContext(StudentContext);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const hideModal = () => {
    setIsModalOpen(false);
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
        <td title={student.notes}>{student.note}</td>
        <td>
          <button type="button" className={"edit-student"} onClick={showModal}>
            Edit
          </button>
        </td>
        <td>
          <button
            type="button"
            className={"delete-student"}
            onClick={async () => {
              deleteStudent(student.id_number, setStudents);
            }}
          >
            Delete
          </button>
        </td>
      </tr>
      {isModalOpen && (
        <StudentFormModal
          purpose={"Edit"}
          student={student}
          isOpen={isModalOpen}
          closeModal={hideModal}
        />
      )}
    </>
  );
}
