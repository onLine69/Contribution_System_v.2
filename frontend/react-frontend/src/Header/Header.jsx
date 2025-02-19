import { useState } from "react";

import "./Header.css";

import DetailsModal from "./Details-Modal.jsx";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };



  return (
    <>
    <header id="header">
      <div id="profile">
        <div id="profile-info" onClick={openModal}>
          <p>
            <b>BUFFICOM OFFICER</b>
          </p>
          <p>CCS-EC</p>
        </div>
        <div>
          <img
            id="profile-picture"
            src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?t=st=1735134285~exp=1735137885~hmac=2877ea17e034aa52a8b1d84e10e7ee5ab6c60e66f6c0a3933786fe1167f954e7&w=996"
            alt="Default Profile"
          />
        </div>
      </div>
    </header>
    {isOpen && <DetailsModal isOpen={isOpen} closeModal={closeModal}/>}
    </>
  );
}