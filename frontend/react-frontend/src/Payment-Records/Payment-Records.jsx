import { useState, useEffect } from "react";
import "./Payment-Records.css";

function PaymentRecords() {
  const [columnSearch, setColumnSearch] = useState("full_name");
  const [paramSearch, setParamSearch] = useState("");
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/payment-records/get-records",
        { method: "GET" }
      );
      const text = await response.text();
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = JSON.parse(text);
      console.log(data);
      const updatedData = data['students'].map((element, index) => ({
        ...element,
        number: index,
      }));
      setPayments(updatedData);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setError(error);
    }
  };

  useEffect(() => {fetchPayments()}, []);

  const operationArea = (
      <div
        style={{
          width: "100%",
          backgroundColor: "#F4F5FF",
          position: "sticky",
          top: "100px",
          zIndex: "1000",
        }}
      >
        <div id="student-records-actions">
          <div id="search-student-form">
            <select
              name="column-search"
              id="column-search"
              value={columnSearch}
              onChange={(e) => setColumnSearch(e.target.value)}
            >
              <option value="full_name">Name</option>
              <option value="id_number">ID Number</option>
              <option value="gender">Gender</option>
              <option value="year_level">Year Level</option>
              <option value="program_code">Program Code</option>
            </select>
            <input
              type="text"
              id="param-search"
              placeholder="Search Student Info Here..."
              value={paramSearch}
              onChange={(e) => setParamSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    );

    const filteredPayments = payments;
  return (
    <div>
      {operationArea}
    <table>
    <thead>
        <th scope="col"></th>
        <th scope="col">Name</th>
        <th scope="col">ID Number</th>
        <th scope="col">Balance</th>
        <th scope="col">Status</th>
      </thead>
      <tbody>
        {error ? (
          <tr key="error-row">
            <td colSpan="8"> Error: {error.message}. Check the backend if working. </td>
          </tr>
        ) : filteredPayments.length > 0 ? (
          filteredPayments.map((payment, index) => (
            <tr key={index}>
              <td>{payment.number}</td>
              <td>{payment.full_name}</td>
              <td>{payment.id_number}</td>
              <td>{payment.balance}</td>
              <td>{payment.status}</td>
            </tr>
          ))
        ) : (
          <tr key="error-row">
            {payments.length > 0 ? (
              <td colSpan="8"> No student matches the search parameters. &#123; '{columnSearch}' has "{paramSearch}" &#125; </td>
            ) : (
              <td colSpan="8">
                <i>No Student</i>
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

export default PaymentRecords;