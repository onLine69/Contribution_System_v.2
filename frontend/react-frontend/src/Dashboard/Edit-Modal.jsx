import { useState, useEffect } from "react";

import fetchContributions from "../fetchContributions.js";
import updateContributions from "./requests/updateContributions.js";

export default function EditModal({ isOpen, closeModal }) {
  const [isReadOnly, setIsReadOnly] = useState([false, false]);
  const [contributions, setContributions] = useState({
    f_name: "",
    f_amount: 0,
    s_name: "",
    s_amount: 0,
  });

  useEffect(() => {
    async function processContributions() {
      const rawContributionData = await fetchContributions();
      setContributions({
        f_name: rawContributionData[0].name,
        f_amount: rawContributionData[0].amount,
        s_name: rawContributionData[1].name,
        s_amount: rawContributionData[1].amount,
      });
      setIsReadOnly([
        rawContributionData[0].amount > 0,
        rawContributionData[1].amount > 0,
      ]);
    }
    processContributions();
  }, []);

  // Overlay component
  const overlay = <div className="overlay" onClick={closeModal}></div>;

  const modal = (
    <div className="edit-modal">
      <h1>Edit Contributions</h1>
      <div className="form">
        <div className="form-group">
          <label htmlFor="1st_contribution_name">First Contribution Name</label>
          <input
            type="text"
            id="1st_contribution_name"
            name="1st_contribution_name"
            value={contributions.f_name}
            placeholder="e.g. 1st Semester"
            className={`form-input`}
            onChange={(e) => {
              setContributions({ ...contributions, f_name: e.target.value });
            }}
            maxLength={50}
          />
        </div>
        <div className="form-group">
          <label htmlFor="1st_contribution_amount">
            First Contribution Amount
          </label>
          <input
            type="number"
            id="1st_contribution_amount"
            name="1st_contribution_amount"
            value={contributions.f_amount}
            placeholder="e.g. 100"
            className={`form-input`}
            min={0}
            readOnly={isReadOnly[0]}
            onInput={(e) => {e.target.value = Math.abs(e.target.value)}}
            onChange={(e) => {
              setContributions({ ...contributions, f_amount: e.target.value });
            }}
          />
        </div>
        <br />
        <hr />
        <br />
        <div className="form-group">
          <label htmlFor="2nd_contribution_name">
            Second Contribution Name
          </label>
          <input
            type="text"
            id="2nd_contribution_name"
            name="2nd_contribution_name"
            value={contributions.s_name}
            placeholder="e.g. 2nd Semester"
            className={`form-input`}
            onChange={(e) => {
              setContributions({ ...contributions, s_name: e.target.value });
            }}
            maxLength={50}
          />
        </div>
        <div className="form-group">
          <label htmlFor="2nd_contribution_amount">
            Second Contribution Amount
          </label>
          <input
            type="number"
            id="2nd_contribution_amount"
            name="2nd_contribution_amount"
            value={contributions.s_amount}
            placeholder="e.g. 100"
            className={`form-input`}
            min={0}
            readOnly={isReadOnly[1]}
            onInput={(e) => {e.target.value = Math.abs(e.target.value)}}
            onChange={(e) => {
              setContributions({ ...contributions, s_amount: e.target.value });
            }}
          />
        </div>
      </div>
      <div className="form-buttons">
        <button
          type="button"
          className="save-button"
          onClick={async () => {
            const isSuccess = await updateContributions(contributions);
            if (isSuccess) {
              closeModal();
            }
          }}
        >
          Save
        </button>
        <button type="button" onClick={closeModal} id="cancel-button">
          Close
        </button>
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
