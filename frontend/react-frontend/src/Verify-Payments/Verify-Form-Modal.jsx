// import recordVerified from "./recordVerified.js";
import { useState, useEffect } from "react";
import fetchBlockReps from "../fetchBlockReps.js";

import recordVerifiedPayments from './requests/recordVerifiedPayments.js';
import fetchAcademicYear from '../fetchAcademicYear.js';

import Swal from 'sweetalert2'

export default function VerifyFormModal({verifiesInfo, isOpen, closeModal, programCodes, fetchVerify, setters}){
    const [blockReps, setBlockReps] = useState([]);
    const [academicYear, setAcademicYear] = useState("");
    const [selectedBlockRep, setSelectedBlockRep] = useState("");
    const [selectedYearLevel, setSelectedYearLevel] = useState(1);
    const [selectedProgramCode, setSelectedProgramCode] = useState(programCodes[0]);
    
    const overlay = (
        <div className="overlay" onClick={closeModal}></div>
    );

    useEffect(() => {
        // Async call to fetch block reps
        async function fetchData() {
            const fetchedBlockReps = await fetchBlockReps();
            const thisAcademicYear = await fetchAcademicYear();
            setBlockReps(fetchedBlockReps);
            setAcademicYear(thisAcademicYear);
        }
        fetchData();
    }, []);

    // Modal content
    const modal = (
        <div className="verify-modal">
            <h1>Verify Payments</h1>
            <p className='form-title'><b>Name: </b>{verifiesInfo.name}</p>
            <p className='form-title'><b>Number of Students: </b>{verifiesInfo.payments_count}</p>
            <p className='form-title'><b>Total Amount: </b>&#8369; {verifiesInfo.total_value}</p>

            <div className="form-informations">
                <div className="form-information">
                    <label htmlFor="block_rep_name">Block Rep: </label>
                    <input type="text" list="blockReps" name="block_rep_name" id="block_rep_name" className="form-info" value={selectedBlockRep} onChange={(e) =>  setSelectedBlockRep(e.target.value)}/>
                    <datalist id="blockReps">
                        {blockReps
                        .map((rep, index) => {
                            const detail = `${rep.year_level} - ${rep.program_code}`;
                            return <option key={index} value={rep.full_name} title={detail}>{rep.full_name}</option>;
                        })}
                    </datalist>
                </div>
                <div className="form-information">
                    <label htmlFor="year_level">Year Level</label>
                    <select id="year_level" name="year_level" className="form-info" onChange={(e) => setSelectedYearLevel(e.target.value)}>
                        <option value={1}>1st Year</option>
                        <option value={2}>2nd Year</option>
                        <option value={3}>3rd Year</option>
                        <option value={4}>4th Year</option>
                    </select>
                </div>
                <div className="form-information">
                    <label htmlFor="program_code">Program Code: </label>
                    <select id="program_code" name="program_code" className="form-info" onChange={(e) => setSelectedProgramCode(e.target.value)}>
                        { programCodes.map((code, index) => {
                            return <option key={index} value={code}>{code}</option>;
                        }) }
                    </select>
                </div>
            </div>

          <div className="table-area">
            <table>
              <thead>
                <tr>
                  <th scope="col" className='modal-table-header'>
                    ID Number
                  </th>
                  <th scope="col" className='modal-table-header'>
                    Name
                  </th>
                  <th scope="col" className='modal-table-header'>
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {verifiesInfo.payments.map((paymentsInfo, index) => {
                  return (
                    <tr key={index}>
                      <td className='modal-table-cell'>
                        <input type="text" name="student-id" value={paymentsInfo.student_id} className="form-control" readOnly/>
                      </td>
                      <td className='modal-table-cell'>
                        <input type="text" name="student_name" value={paymentsInfo.student_name} className="form-control" readOnly/>
                      </td>
                      <td className='modal-table-cell'>
                        <textarea name="transaction-message" id="transaction-message"
                          data-number={index}
                          value={paymentsInfo.student_note}
                          className="form-control"
                          maxLength="255"
                          onChange={(e) => {
                          const key = e.target.getAttribute("data-number"); // Get the key (index) from data-number
                          const value = e.target.value; // Get the input value

                          verifiesInfo.setVerifyTransactions((prev) => {
                                const updatedPayments = [...prev.payments];
                                updatedPayments[key].student_note = value; // Update the specific student_note
                                return { ...prev, payments: updatedPayments };
                            });
                          }}
                        >
                          {paymentsInfo.student_note}
                        </textarea>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className='button-area'>
            <button id='ok-button' 
                onClick={() => {
                    if (selectedBlockRep.trim() === ""){
                        Swal.fire({
                            title: "Block Representative Name Required",
                            text: `Please input the name of the block representative.`,
                            icon: 'warning',
                            confirmButtonText: 'OK'
                        });
                        const blockRepInput = document.getElementById('block_rep_name');
                        blockRepInput.style.border = '1px solid red';
                        blockRepInput.focus();
                    } else {
                        const receiptDetails = {
                            contribution_name: verifiesInfo.name,
                            amount: verifiesInfo.amount,
                            academic_year: academicYear.academic_year,
                            block_rep_name: selectedBlockRep,
                            verification_date: new Date().toISOString().replace('T', ' ').slice(0, 19),
                            program_code: selectedProgramCode,
                            year_level: selectedYearLevel,
                            total_amount: verifiesInfo.total_value,
                            verified_payments: verifiesInfo.payments
                        };
                        recordVerifiedPayments(receiptDetails, closeModal, fetchVerify, setters);
                    }
                }}
            >
                OK
            </button>
            <button id='cancel-button'
              onClick={closeModal} >
                Cancel
            </button>
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