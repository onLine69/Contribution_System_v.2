import { useState, useEffect } from "react";

import TableHeader from "./Table-Header.jsx";
import TableRow from "./Table-Row.jsx";
import FilterArea from "./FIlter-Area.jsx";
import StatisticsArea from "./Statistic-Area.jsx";
import PaymentFormModal from "./Payment-Form-Modal.jsx";

import fetchProgramCodes from "../fetchProgramCodes.js";
import fetchPayments from "./requests/fetchPayments.js";
import transactPayments from "./requests/transactPayments.js";

import "./Payment-Records.css";

export default function PaymentRecords() {
  const [searchParams, setSearchParams] = useState({
    column: "full_name",
    input: "",
  });
  const [filterParams, setFilterParams] = useState({
    programFilter: "All",
    yearFilter: "0",
    statusFilter: "All",
  });
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [programCodes, setProgramCodes] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState({});
  const [stat, setStat] = useState({});
  const [paymentTransactions, setPaymentTransactions] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  // Function to show the modal
  const showModal = () => {
    setIsModalOpen(true); // Set state to open the modal
  };
  // Function to hide the modal
  const hideModal = () => {
    setIsModalOpen(false); // Set state to close the modal
  };

  const setters = {
    setPayments: setPayments,
    setError: setError,
    setContributions: setContributions,
    setSelectedContribution: setSelectedContribution,
    setStat: setStat,
  };

  useEffect(() => {
    fetchProgramCodes(setProgramCodes);
    fetchPayments(selectedContribution?.name || "default", setters);
  }, []);

  const operationArea = (
    <div id="operation-area">
      <div id="payment-records-actions">
        <div id="search-payment-form">
          <select
            name="column-search"
            id="column-search"
            value={searchParams.column}
            onChange={(e) =>
              setSearchParams((param) => {
                return { ...param, column: e.target.value };
              })
            }
          >
            <option value="full_name">Name</option>
            <option value="id_number">ID Number</option>
          </select>
          <input
            type="text"
            id="param-search"
            placeholder="Search Payment Info Info Here..."
            value={searchParams.input}
            onChange={(e) =>
              setSearchParams((param) => {
                return { ...param, input: e.target.value };
              })
            }
          />
        </div>
        <div>
          <button
            id="transact-payments"
            title="Transact Selected Records"
            onClick={() => {
              transactPayments(
                setPaymentTransactions,
                selectedContribution,
                showModal
              );
            }}
          >
            Transact
          </button>
        </div>
      </div>
    </div>
  );

  const filteredPayments = filterPayments(payments, filterParams, searchParams);

  const filterArea = (
    <div id="filter-area">
      <FilterArea
        programCodes={programCodes}
        setFilterParams={setFilterParams}
      />

      <StatisticsArea
        filteredStatus={filterParams.statusFilter}
        contributions={contributions}
        choosenContribution={{
          selectedContribution: selectedContribution,
          fetchPayments: fetchPayments,
        }}
        stat={{ ...stat, payment_records_length: filteredPayments.length }}
        setters={setters}
      />
    </div>
  );

  return (
    <div>
      {filterArea}
      {operationArea}
      {isModalOpen && (
        <PaymentFormModal
          paymentsInfo={paymentTransactions}
          isOpen={isModalOpen}
          closeModal={hideModal}
          fetchPayments={fetchPayments}
          setters={setters}
        />
      )}
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
                  {searchParams.column}' has "{searchParams.input}" &#125;
                  <br />
                  Filters: {filterParams.programFilter} &#40;Program&#41; |{" "}
                  {filterParams.yearFilter !== "0" ? filterParams.yearFilter : "All"}
                  &#40;Year Level&#41; | {filterParams.statusFilter}{" "}
                  &#40;Status&#41;
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

function filterPayments(payments, filterParams, searchParams) {
  return payments
    .filter((student) => {
      return (
        (filterParams.programFilter === "All" ||
          student["program_code"] === filterParams.programFilter) &&
        (filterParams.yearFilter === "0" ||
          student["year_level"] === filterParams.yearFilter) &&
        (filterParams.statusFilter === "All" ||
          student["status"] === filterParams.statusFilter)
      );
    })
    .filter((payment) =>
      payment[searchParams.column].includes(searchParams.input)
    ) // Filter first
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
}
