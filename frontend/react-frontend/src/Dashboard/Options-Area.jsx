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

    return (
        <>
        <div className="options-area">
            <div>
                <h3 className="card-title">Options</h3>
            </div>
            <button type="button"
            onClick={openEditModal}
            >Edit Contributions</button>
            <button type="button"
             onClick={openListModal}
             >Generate List</button>
        </div>
        {isListModalOpen && <GenerateListModal isOpen={isListModalOpen} closeModal={closeListModal}/>}
        {isEditModalOpen && <EditModal isOpen={isEditModalOpen} closeModal={closeEditModal}/>}
        </>
    );
}