import Swal from 'sweetalert2'

export async function submitForm(purpose, setErrors, isOkay, student){
    // Check for empty fields except notes
    const emptyFields = Object.keys(student).filter(key => student[key] === '' && key !== 'notes');
    if (emptyFields.length > 0) {
        emptyFields.forEach((key) => {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors }; // Make a copy of previous errors
                switch (key) {
                    case "full_name":
                        newErrors.full_name = "Full name is required";
                        break;
                    case "id_number":
                        newErrors.id_number = "ID number is required";
                        break;
                    default:
                        break;
                }
                return newErrors; // Return the updated errors
            })
        })

        Swal.fire({
            title: "Cannot have empty fields.",
            text: "Please set a valid fill all fields.",
            icon: 'error',
            confirmButtonText: 'OK'
        });

        return false;
    }

    if (isOkay) {
        const URL = purpose === "Add"? "http://127.0.0.1:5000/student-records/add" : "http://127.0.0.1:5000/student-records/update";
        const METHOD = purpose === "Add"? "POST" : "PUT";
        
        const response = await fetch(URL, 
            {
                method: METHOD,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(student)
            }
        );

        if (!response.ok) {
            const promiseResult = await response.json();

            const regex = /\((\d+), "Duplicate entry '([^']+)' for key '([^']+)'"/;
            const matches = promiseResult.message.match(regex);
            let errorVal = "";
            if (matches) {
                if (matches[1] === "1062"){
                    setErrors((prevErrors) => {
                        const newErrors = { ...prevErrors }; // Make a copy of previous errors
                        if (matches[3].includes("PRIMARY")){
                            newErrors.id_number = "Student with same ID Number already exist.";
                        } else {
                            newErrors.full_name = "Student already exist.";
                        }
                        return newErrors; // Return the updated errors
                    })
                    errorVal += `Duplicate entry for '${matches[2]}'`;
                } else {
                    errorVal += `Error Code '${matches[1]}' | Value: ${matches[2]} | Caused by: ${matches[3]}.`;
                }
            } else {
                errorVal += `Error message: ${promiseResult.message}`;
            }

            Swal.fire({
                title: "Error",
                text: errorVal,
                icon: 'error',
                confirmButtonText: 'OK'
            });

            return false;
        } else {
            const tailMessage = purpose === "Add" ? "added successfully." : "updated sucessfully.";
            Swal.fire({
                title: "Success",
                text: `Student ${student.id_number} ${tailMessage}`,
                icon: 'success',
                confirmButtonText: 'OK'
            });

            return true;
        }
    } else {
        Swal.fire({
            title: "Errors",
            text: "Please fix the errors first.",
            icon: 'error',
            confirmButtonText: 'OK'
        });

        return false;
    }
}