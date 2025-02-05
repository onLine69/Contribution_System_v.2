import { useState } from "react";

import GenerateListModal from "./Generate-List-Modal.jsx";
import EditModal from "./Edit-Modal.jsx"

export default function OptionsArea() {
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const openListModal = () => {
        setIsListModalOpen(true);
    };
    const closeListModal = () => {
        setIsListModalOpen(false);
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const openEditModal = () => {
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const buttonStyles = {
        cursor: "pointer",
        width: "70%",
        margin: "5px auto",
        height: "30px",
        borderRadius: "8px"
    };
    return (
        <>
        <div 
        style={{
            width: "20%",
            height: "100%",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "black 1px solid"
        }}
        >
            <div>
                <h3 className="card-title">Options</h3>
            </div>
            <button type="button"
            onClick={openEditModal}
            style={buttonStyles}>Edit Contributions</button>
            <button type="button"
             onClick={openListModal}
             style={buttonStyles}>Generate List</button>
        </div>
        {isListModalOpen && <GenerateListModal isOpen={isListModalOpen} closeModal={closeListModal}/>}
        {isEditModalOpen && <EditModal isOpen={isEditModalOpen} closeModal={closeEditModal}/>}
        </>
    );
}