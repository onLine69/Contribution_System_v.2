import Swal from 'sweetalert2'

export async function deleteStudent(studentID, setStudents){
    Swal.fire({
        title: "Are you sure you want to delete this student?",
        text: `Once deleted, student '${studentID}' can never be recovered.`,
        icon: "warning",
        showCancelButton: true
    }).then((willDelete) => {
        if (willDelete.isConfirmed){
            fetch(`http://127.0.0.1:5000/student-records/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'id_number': studentID})
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        text:  `Student '${studentID}' has been deleted successfully.`,
                        icon: "success"
                    }).then(() => {
                        setStudents(prevStudents => {return prevStudents.filter(pStudent => pStudent.id_number !== studentID)});
                    });
                } else {
                    Swal.fire({
                        text:  'Failed to delete the note. Please try again.',
                        icon: "error"
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    text:  `An error occurred. Please try again later. \n Error: ${error}`,
                    icon: "error"
                });
            });
        } else {
            Swal.fire({
                text: "Note deletion is cancelled."
            });
        }
    }); 
}