import { useState, useEffect } from 'react';
import TableHeader from './Table-Header.jsx';
import TableRow from './Table-Row.jsx';
import FilterArea from './FIlter-Area.jsx';
import StatisticsArea from './Statistic-Area.jsx';


import fetchProgramCodes from "../fetchProgramCodes.js";
import fetchVerify from "./fetchVerify.js";

export default function VerifyPayments() {
  const [searchParams, setSearchParams] = useState({
    column: "full_name",
    input: "",
  });
  const [filterParams, setFilterParams] = useState({
    yearFilter: "0",
    statusFilter: "All",
  });
  const [verifies, setVerifies] = useState([]);
  const [error, setError] = useState(null);
  const [programCodes, setProgramCodes] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState({});
  
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
    setVerifies: setVerifies,
    setContributions: setContributions,
    setSelectedContribution: setSelectedContribution,
    setError: setError,
  };

  useEffect(() => {
    fetchProgramCodes(setProgramCodes);
    fetchVerify(selectedContribution?.name || "default", setters);
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
                alert(searchParams.column + ": " + searchParams.input);
                // transactPayments(
                //   setPaymentTransactions,
                //   selectedContribution,
                //   showModal
                // );
              }}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    );

  const filteredVerifies = filterVerifies(verifies, filterParams, searchParams);
  return (
      <div>
        <div id="filter-area">
          <FilterArea programCodes={programCodes} setFilterParams={setFilterParams} />
          <StatisticsArea 
            contributions={contributions} 
            choosenContribution={{
              selectedContribution: selectedContribution,
              fetchVerify: fetchVerify
            }}
            setters={setters}
          />
        </div>
        {operationArea}
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
            ) : filteredVerifies.length > 0 ? (
              filteredVerifies.map((verify, index) => (
                <TableRow key={verify.number} verify={verify} />
              ))
            ) : (
              <tr key="error-row">
                {verifies.length > 0 ? (
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

function filterVerifies(verifies, filterParams, searchParams) {
  return verifies
    .filter((payment) => {
      return (
        (filterParams.programFilter === "All" ||
          payment["program_code"] === filterParams.programFilter) &&
        (filterParams.yearFilter === "0" ||
          payment["year_level"] === filterParams.yearFilter)
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