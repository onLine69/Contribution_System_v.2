import { useState, useEffect } from "react";

import fetchAccountDetails from "./fetchAccountDetails.js";
import sendBlockrepIDs from "./sendBlockrepIDs.js"

export default function DetailsModal({ isOpen, closeModal }) {
    const [accountDetails, setAccountDetails] = useState(
        {
            account: {
              code: null,
              email: null,
              name: null
            },
            block_reps: null
        }
    );
    useEffect(() => {
        async function getData() {
          try {
            const data = await fetchAccountDetails();
            setAccountDetails(data);
          } catch (error) {
            console.error("There was a problem with the fetch operation:", error.message);
          }
        }
    
        getData();
      }, [isOpen]);
    // Overlay component
    const overlay = <div className="overlay-details" onClick={closeModal}></div>;
    const modal = (
        <div className="modal-details">
            <h1>Account Details</h1>
            <div className="form">
                <div className="form-group">
                    <label htmlFor="organization_code">Organization Code</label>
                    <input
                        type="text"
                        id="organization_code"
                        name="organization_code"
                        placeholder="e.g. CCS-EC"
                        className={`form-input`}
                        readOnly={true}
                        maxLength={10}
                        value={accountDetails.account.code}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="organization_name">Organization Name</label>
                    <input
                        type="text"
                        id="organization_name"
                        name="organization_name"
                        placeholder="e.g. College of Computer Studies Executive Council"
                        className={`form-input`}
                        readOnly={true}
                        maxLength={100}
                        value={accountDetails.account.name}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="organization_email">Organization Email</label>
                    <input
                        type="text"
                        id="organization_email"
                        name="organization_email"
                        placeholder="e.g. ccs.ec@g.msuiit.edu.ph"
                        className={`form-input`}
                        readOnly={true}
                        maxLength={100}
                        value={accountDetails.account.email}
                    />
                </div>
            </div>
            <br />
            <hr />
            <br />
            <div className="form">
                <div className="form-group">
                    <label htmlFor="blockrep_ids">Block Representatives IDs</label>
                    <textarea 
                        id="blockrep_ids"
                        name="blockrep_ids"
                        placeholder="e.g. 2022-0378,2022-2534,2021-1756"
                        value={accountDetails.block_reps}
                        className={`form-input`}
                        onChange={(e) => {
                            setAccountDetails({ ...accountDetails, block_reps: e.target.value })
                            const trimed = e.target.value.trim();
                            if (validateInput(trimed)){
                                e.target.style.borderColor = "";
                                sendBlockrepIDs(IDparser(trimed.replace(" ", "")));
                            } else {
                                e.target.style.borderColor = "red";
                            }  
                        }}
                        ></textarea>
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


function validateInput(input) {
    // Regular expression to match the required format
    const pattern = /^\d{4}-\d{4}(?:,\d{4}-\d{4})*$/;
    return pattern.test(input) || input === "";
}

function IDparser(ids){
    return ids.split(",");
}