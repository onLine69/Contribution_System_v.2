import Swal from 'sweetalert2'

export default async function bulkAddStudents(e, fetchStudents) {
    const fileInput = e.target;
    const file = fileInput.files[0]; // Get the selected file

    if (file) {
        const formData = new FormData();
        formData.append("file-upload", file); // Append the file to FormData

        try {
            const response = await fetch("http://127.0.0.1:5000/student-records/bulk-add", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const promiseResult = await response.json();
                throw new Error(`Processing failed: ${promiseResult.message}`);
            }

            const result = await response.json();
            Swal.fire({
                text: "File uploaded successfully.",
                icon: "success",
            })
        } catch (error) {
            const errorMessage = error.message;
            console.log(errorMessage);

            Swal.fire({
                title: "File upload failed.",
                text: "There is a problem with the file/data you have provided. \
                        Please make sure that it is in the right format and no duplicate student/s is listed. \
                        See documentation for the format.",
                icon: "error",
            })
        } finally {
            fileInput.value = ""; // Clear the file input after the process is complete
            fetchStudents();
        }
    }
};