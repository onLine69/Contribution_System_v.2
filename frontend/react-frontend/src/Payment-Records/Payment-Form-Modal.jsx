import recordPayments from "./requests/recordPayments";

export default function PaymentFormModal({
  paymentsInfo,
  isOpen,
  closeModal,
  fetchPayments,
  setters,
}) {
  // Overlay component
  const overlay = <div className="overlay" onClick={closeModal}></div>;

  // Modal content
  const modal = (
    <div className="payment-modal">
      <h1>Transact Payments</h1>
      <p className="form-title">
        <b>Contribution Name: </b>
        {paymentsInfo.name}
      </p>
      <p className="form-title">
        <b>Number of Students: </b>
        {paymentsInfo.students_count}
      </p>
      <p className="form-title">
        <b>Total Amount: </b>&#8369; {paymentsInfo.total_value}
      </p>

      <div className="table-area">
        <table>
          <thead>
            <tr>
              <th scope="col" className="modal-table-header">
                ID Number
              </th>
              <th scope="col" className="modal-table-header">
                Name
              </th>
              <th scope="col" className="modal-table-header">
                Note
              </th>
            </tr>
          </thead>
          <tbody>
            {paymentsInfo.transactions.map((transactionInfo, index) => {
              return (
                <tr key={index}>
                  <td className="modal-table-cell">
                    <input
                      type="text"
                      name="student-id"
                      value={transactionInfo.student_id}
                      className="form-control"
                      readOnly
                    />
                  </td>
                  <td className="modal-table-cell">
                    <input
                      type="text"
                      name="student_name"
                      value={transactionInfo.student_name}
                      className="form-control"
                      readOnly
                    />
                  </td>
                  <td className="modal-table-cell">
                    <textarea
                      name="transaction-message"
                      id="transaction-message"
                      data-number={index}
                      value={transactionInfo.student_note}
                      className="form-control"
                      maxLength="255"
                      onChange={(e) => {
                        const key = e.target.getAttribute("data-number"); // Get the key (index) from data-number
                        const value = e.target.value; // Get the input value

                        paymentsInfo.setPaymentTransactions((prev) => {
                          const updatedTransactions = [...prev.transactions];
                          updatedTransactions[key].student_note = value; // Update the specific student_note
                          return { ...prev, transactions: updatedTransactions };
                        });
                      }}
                    >
                      {transactionInfo.student_note}
                    </textarea>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="button-area">
        <button
          id="ok-button"
          onClick={() =>
            recordPayments(paymentsInfo, fetchPayments, setters, closeModal)
          }
        >
          OK
        </button>
        <button id="cancel-button" onClick={closeModal}>
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
