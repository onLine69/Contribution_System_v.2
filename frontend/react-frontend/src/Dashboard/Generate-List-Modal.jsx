import { useState, useEffect } from "react";

import generateStudentList from "./requests/generateStudentList.js";
import fetchContributions from "../fetchContributions.js";

export default function GenerateListModal({ isOpen, closeModal }) {
  const [contributionsName, setContributionsName] = useState({
    f_name: "",
    s_name: ""
  });
  
  useEffect(() => {
     async function processContributions() {
          const rawContributionData = await fetchContributions();
          setContributionsName({
            f_name: rawContributionData[0].name,
            s_name: rawContributionData[1].name,
          })
        }
        processContributions();
  }, [isOpen])
  
  // Overlay component
  const overlay = <div className="overlay" onClick={closeModal}></div>;

  const modal = (
    <div className="list-modal">
      <h1>Generate Students List</h1>
      <div className="form">
        <div className="form-group">
          <select
            name="filter-program"
            id="filter-program"
            className="form-input"
            title="Filter Program Code"
            onChange={(e) => {
              const selectedOption = e.target.options[e.target.selectedIndex];
              const dataName = selectedOption.getAttribute("data-name");
              generateStudentList(e.target.value, dataName);
            }}
          >
            <option value="None">--Select List--</option>
            <option value="All" data-name="All">All Students</option>
            <option value="Paid" data-name={contributionsName.f_name}>Paid Students ({contributionsName.f_name})</option>
            <option value="Unpaid" data-name={contributionsName.f_name}>Unpaid Students ({contributionsName.f_name})</option>
            <option value="Paid" data-name={contributionsName.s_name}>Paid Students ({contributionsName.s_name})</option>
            <option value="Unpaid" data-name={contributionsName.s_name}>Unpaid Students ({contributionsName.s_name})</option>
          </select>
        </div>
      </div>
    </div>
  );

  return isOpen ? (
    <>
      {overlay}
      {modal}
    </>
  ) : null;
}
