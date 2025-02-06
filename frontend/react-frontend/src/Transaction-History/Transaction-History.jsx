import { useState, useEffect } from "react";

import TableHeader from "./Table-Header.jsx";
import TableRow from "./Table-Row.jsx";
import FilterArea from "./FIlter-Area.jsx";
import FilterRange from "./Filter-Range.jsx";
import StatisticsArea from "./Statistic-Area.jsx";

import fetchHistory from "./requests/fetchHistory.js";
import generateList from "./requests/generateList.js";

import fetchProgramCodes from "../fetchProgramCodes.js";

export default function TransactionHistory() {
  const [searchParams, setSearchParams] = useState({
    column: "id",
    input: "",
  });
  const [filterParams, setFilterParams] = useState({
    programFilter: "All",
    yearFilter: "0",
    statusFilter: "All",
  });
  const [dateTimeRange, setDateTimeRange] = useState({
    start: "",
    end: "",
  });
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [programCodes, setProgramCodes] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState({});
  const [stat, setStat] = useState({});

  const setters = {
    setHistory: setHistory,
    setError: setError,
    setContributions: setContributions,
    setSelectedContribution: setSelectedContribution,
    setStat: setStat,
  };

  useEffect(() => {
    fetchProgramCodes(setProgramCodes);
    fetchHistory(selectedContribution?.name || "default", setters);
  }, []);

  const filteredHistory = filterHistory(
    history,
    filterParams,
    dateTimeRange,
    searchParams
  );
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
            <option value="id">Transaction ID</option>
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
        {/* Generate List Button */}
        <button
          className="generate-transaction-pdf"
          onClick={() => generateList(filteredHistory)}
        >
          Generate List in PDF
        </button>
      </div>
    </div>
  );

  const filterArea = (
    <div id="filter-area">
      <FilterArea
        programCodes={programCodes}
        setFilterParams={setFilterParams}
      />
      <FilterRange
        dateTimeRange={dateTimeRange}
        setDateTimeRange={setDateTimeRange}
      />
      <StatisticsArea
        contributions={contributions}
        choosenContribution={{
          selectedContribution: selectedContribution,
          fetchHistory: fetchHistory,
        }}
        setters={setters}
      />
    </div>
  );

  return (
    <div>
      {filterArea}
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
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((history, index) => (
              <TableRow key={history.number} history={history} />
            ))
          ) : (
            <tr key="error-row">
              {history.length > 0 ? (
                <td colSpan="8">
                  No payment record matches the parameters. &#123; '
                  {searchParams.column}' has "{searchParams.input}" &#125;
                  <br />
                  Filters: {filterParams.programFilter} &#40;Program&#41; |{" "}
                  {filterParams.yearFilter !== "0"
                    ? filterParams.yearFilter
                    : "All"}
                  &#40;Year Level&#41; | {filterParams.statusFilter}{" "}
                  &#40;Status&#41; Date Time Range: {dateTimeRange.start} -{" "}
                  {dateTimeRange.end}
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

function filterHistory(history, filterParams, dateTimeRange, searchParams) {
  dateTimeRange = {
    start: dateTimeRange.start === "" ? "" : dateFormat(dateTimeRange.start),
    end: dateTimeRange.end === "" ? "" : dateFormat(dateTimeRange.end),
  };
  return history
    .filter((transaction) => {
      return (
        (filterParams.programFilter === "All" ||
          transaction["program_code"] === filterParams.programFilter) &&
        (filterParams.yearFilter === "0" ||
          transaction["year_level"] === filterParams.yearFilter) &&
        (filterParams.statusFilter === "All" ||
          transaction["status"] === filterParams.statusFilter)
      );
    })
    .filter((transaction) => {
      return (
        (dateTimeRange.start === "" ||
          transaction["datetime"] >= dateTimeRange.start) &&
        (dateTimeRange.end === "" ||
          transaction["datetime"] <= dateTimeRange.end)
      );
    })
    .filter((transaction) =>
      transaction[searchParams.column].toString().includes(searchParams.input)
    )
    .sort((a, b) => {
      // Sorting priority: program_code, then year_level, then full_name
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });
}

function dateFormat(udate) {
  return `${udate.replace("T", " ")}:00`;
}
