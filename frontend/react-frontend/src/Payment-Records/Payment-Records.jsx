import { useState, useEffect } from "react";
import TableHeader from "./Table-Header.jsx";
import TableRow from "./Table-Row.jsx";
import FilterArea from "./FIlter-Area.jsx";
import StatisticsArea from "./Statistic-Area.jsx";
import PaymentFormModal from "./Payment-Form-Modal.jsx";
import "./Payment-Records.css";

import fetchProgramCodes from "../fetchProgramCodes.js";

export default function PaymentRecords() {
  const [columnSearch, setColumnSearch] = useState("full_name");
  const [paramSearch, setParamSearch] = useState("");
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [programCodes, setProgramCodes] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState({});
  const [stat, setStat] = useState({});
  const [selectedPCode, setSelectedPCode] = useState("All");
  const [selectedYear, setSelectedYear] = useState("0");
  const [selectedStatus, setSelectedStatus] = useState("All");
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to show the modal
  const showModal = () => {
    setIsModalOpen(true); // Set state to open the modal
  };

  // Function to hide the modal
  const hideModal = () => {
    setIsModalOpen(false); // Set state to close the modal
  };

  // TODO: Fix the default fetch request for contribution and the statistics for searching individual programs and/or year levels 
  const fetchPayments = (s_contribution) => {
    fetch(`http://127.0.0.1:5000/payment-records/get-records/CCS-EC/${s_contribution}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text(); // Return the text response
      })
      .then((text) => {
        const data = JSON.parse(text); // Parse JSON
        console.log(data);
  
        // Map and update students data
        const updatedData = data["students"].map((element, index) => ({
          ...element,
          number: index,
        }));
  
        // Update states
        setContributions(data['contributions']);
        setSelectedContribution(data['chosen_contribution']);
        setStat(data['stat']);
        setPayments(updatedData);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError(error); // Handle errors
      });
  };
  

  useEffect(() => {
    fetchProgramCodes(setProgramCodes);
    fetchPayments(selectedContribution?.name || 'default');
  }, []);

  const [paymentTransactions, setPaymentTransactions] = useState({});
  const transactPayments = () => {
    const toBeTransact = document.querySelectorAll('input[name="transact-student"]:checked');
    const transactionList = [];
    toBeTransact.forEach((transact) => {
      const row = transact.closest('tr');
      const studentId = row.querySelector('td:nth-child(3)').textContent; // Get Student ID
      const studentName = row.querySelector('td:nth-child(2)').textContent; // Get Student Name
      const studentNote = "";

      const transactionInfo = {
        "student_id": studentId,
        "student_name": studentName,
        "student_note": studentNote
      }

      transactionList.push(transactionInfo);
    });

    const transactionsInfo = {
      "total_value": selectedContribution.amount * transactionList.length,
      "transactions": transactionList,
      setPaymentTransactions: setPaymentTransactions
    };
    setPaymentTransactions(transactionsInfo);
  }
  const operationArea = (
    <div
      style={{
        width: "100%",
        backgroundColor: "#F4F5FF",
        position: "sticky",
        top: "400px",
        zIndex: "1000",
      }}
    >
      <div id="payment-records-actions">
        <div id="search-payment-form">
          <select
            name="column-search"
            id="column-search"
            value={columnSearch}
            onChange={(e) => setColumnSearch(e.target.value)}
          >
            <option value="full_name">Name</option>
            <option value="id_number">ID Number</option>
          </select>
          <input
            type="text"
            id="param-search"
            placeholder="Search Payment Info Info Here..."
            value={paramSearch}
            onChange={(e) => setParamSearch(e.target.value)}
          />
        </div>
        <div>
          <button id="transact-payments" title="Transact Selected Records" onClick={() => {transactPayments(); showModal();}}>
            Transact
          </button>
        </div>
      </div>
    </div>
  );

  const filteredPayments = payments
    .filter((student) => {
      return (
        (selectedPCode === "All" || student["program_code"] === selectedPCode) &&
        (selectedYear === "0" || student["year_level"] === selectedYear) &&
        (selectedStatus === "All" || student["status"] === selectedStatus)
      );
    })
    .filter((payment) => payment[columnSearch].includes(paramSearch)) // Filter first
    .sort((a, b) => {
      // Sorting priority: program_code, then year_level, then full_name
      if (a.program_code < b.program_code) return -1;
      if (a.program_code > b.program_code) return 1;
      if (a.year_level < b.year_level) return -1;
      if (a.year_level > b.year_level) return 1;
      if (a.full_name < b.full_name) return -1;
      if (a.full_name > b.full_name) return 1;
      return 0;
    });

    const filterArea = (
      <div style={{
        width: "90%",
        margin: "0px auto",
        height: "300px",
        backgroundColor: "#F4F5FF",
        position: "sticky",
        top: "100px",
        zIndex: "1000",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
      }}>
        <FilterArea programCodes={programCodes} 
          controls={{
            setSelectedPCode: setSelectedPCode,
            setSelectedYear: setSelectedYear,
            setSelectedStatus: setSelectedStatus,
          }} />
        <StatisticsArea filteredStatus={selectedStatus} contributions={contributions} 
        choosenContribution={{
          selectedContribution: selectedContribution,
          fetchPayments: fetchPayments
        }} 
        stat={{...stat, payment_records_length: filteredPayments.length}} />
      </div>
    );

  return (
    <div>
      {filterArea}
      {operationArea}
      {isModalOpen && <PaymentFormModal paymentsInfo={paymentTransactions} isOpen={isModalOpen} closeModal={hideModal} />}
      <table>
        <TableHeader />
        <tbody>
          {error ? (
            <tr key="error-row">
              <td colSpan="8">
                {" "}
                Error: {error.message}. Check the backend if working.{" "}
              </td>
            </tr>
          ) : filteredPayments.length > 0 ? (
            filteredPayments.map((payment, index) => (
              <TableRow key={payment.number} payment={payment} />
            ))
          ) : (
            <tr key="error-row">
              {payments.length > 0 ? (
                <td colSpan="8">
                  No payment record matches the parameters. &#123; '
                  {columnSearch}' has "{paramSearch}" &#125;
                  <br />
                  Filters: {selectedPCode} &#40;Program&#41; | {selectedYear}{" "}
                  &#40;Year Level&#41; | {selectedStatus} &#40;Status&#41;
                </td>
              ) : (
                <td colSpan="8">
                  <i>No Payment Record</i>
                </td>
              )}
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="8">
              <i>End of Table</i>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
