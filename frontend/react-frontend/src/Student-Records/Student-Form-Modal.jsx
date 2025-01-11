import { useState, useContext } from "react";
import { submitForm } from "./requests/submitForm.js";
import { StudentContext } from "./Student-Records.jsx";
import "./Student-Form-Modal.css";


export default function StudentFormModal({ purpose, student, isOpen , closeModal }) {
    const {setStudents, programCodes} = useContext(StudentContext);
    const [formData, setFormData] = useState({
        full_name: student?.full_name || '',
        id_number: student?.id_number || '',
        gender: student?.gender || 'M',
        year_level: student?.year_level || 1,
        program_code: student?.program_code || programCodes[0],
        notes: student?.notes || '',
    });

    const [errors, setErrors] = useState({});
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Update form data
        setFormData({ ...formData, [name]: value });
    
        // Create a new error object based on validation
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors }; // Make a copy of previous errors
            
            // Validation logic for each field
            switch (name) {
                case "full_name":
                    newErrors.full_name = value.length < 1 ? "Full name is required" : "";
                    break;
                case "id_number":
                    newErrors.id_number = value.length < 1 ? "ID number is required" : "";
                    if (!/^\d{4}-\d{4}$/.test(value) && value.length >= 1) {
                        newErrors.id_number = "ID number must be in the format NNNN-NNNN. E.g. 2021-1756";
                    }
                    break;
                default:
                    break;
            }
    
            // Remove any errors that are empty
            Object.keys(newErrors).forEach((key) => {
                if (newErrors[key] === "") {
                    delete newErrors[key]; // Remove the empty error
                }
            });
    
            return newErrors; // Return the updated errors
        });
    };
    
    // Overlay component
    const overlay = (
        <div className="overlay" onClick={closeModal}></div>
    );

    // Modal content
    const modal = (
        <div className="modal">
            <h1 style={{width: "50%", margin: "10px auto", display: "flex", justifyContent: "center"}}>{purpose} Student</h1>
            <div className={"form"}>
                <div className="form-group">
                    <label htmlFor="full_name">Full Name</label>
                    <input type="text" id="full_name" name="full_name" value={formData.full_name} 
                    placeholder="e.g. Doe, John A."
                    className={`form-input ${errors.full_name ? 'error' : ''}`} 
                    onChange={handleChange}
                    maxLength={155}
                    />
                    {errors.full_name && <span className="error-name">{errors.full_name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="id_number">ID Number</label>
                    <input type="text" id="id_number" name="id_number" value={formData.id_number} 
                    placeholder="e.g. 2022-2534"
                    className={`form-input ${errors.id_number ? 'error' : ''}`} 
                    onChange={handleChange}
                    maxLength={9}
                    minLength={9}
                    />
                    {errors.id_number && <span className="error-name">{errors.id_number}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" name="gender" value={formData.gender} className={"form-input"} onChange={handleChange} >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="year_level">Year Level</label>
                    <select id="year_level" name="year_level" value={formData.year_level} className={"form-input"} onChange={handleChange} >
                        <option value={1}>1st Year</option>
                        <option value={2}>2nd Year</option>
                        <option value={3}>3rd Year</option>
                        <option value={4}>4th Year</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="program_code">Program Code</label>
                    <select id="program_code" name="program_code" value={formData.program_code} className={"form-input"} onChange={handleChange} >
                        { programCodes.map((code, index) => {
                            return <option key={index} value={code}>{code}</option>;
                        }) }
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea id="notes" name="notes" value={formData.notes} rows="4" className={"form-input"} maxLength={255} onChange={handleChange}
                    >{formData.notes}</textarea>
                </div>

                <div className="form-group" style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                    <button type="button" className={purpose} style={{ padding: "10px 20px", borderRadius: "4px", cursor: "pointer" }}
                    onClick={async () => {
                        if (purpose === "Edit"){formData.original_id = student?.id_number} 
                        const submitSuccess = await submitForm(purpose, setErrors, Object.keys(errors).length === 0, formData);
                        if(submitSuccess){
                            setStudents(prevStudents => {
                                let updatedStudents = [...prevStudents]; // Create a copy of the array
                            
                                if (purpose === "Edit") {
                                    updatedStudents[student.number] = { ...updatedStudents[student.number], ...formData };  // Merge the updated data
                                } else {
                                    formData['number'] = updatedStudents.length;
                                    updatedStudents.push({ ...student, ...formData });  // Add the new student
                                }
                            
                                return updatedStudents;  // Return the updated array
                            });
                                                
                            closeModal();
                        }
                    }}
                    >
                        { purpose }
                    </button>
                    <button type="button" onClick={closeModal} style={{ padding: "10px 20px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    // Return modal if it's open, otherwise return null
    return isOpen ? (
        <>
            {overlay}
            {modal}
        </>
    ) : null;
}
