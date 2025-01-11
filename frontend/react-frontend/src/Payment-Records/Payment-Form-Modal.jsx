import Swal from 'sweetalert2'

export default function PaymentFormModal({paymentsInfo, isOpen, closeModal, fetchPayments}){
    const transactPayments = async () => {

      Swal.fire({
        title: "Do you want to record these payments?",
        text: "Once recorded, it cannot be undone.",
        showCancelButton: true,
        confirmButtonText: "Record",
        cancelButtonText: `Don't record`
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const response = await fetch("http://127.0.0.1:5000/payment-records/transact-payments", 
              {
                  method: "POST",
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify(paymentsInfo)
              }
          );

          if (!response.ok){
              const promiseResult = await response.json();
              Swal.fire({
                  title: "Error",
                  text: promiseResult.message,
                  icon: 'error',
                  confirmButtonText: 'OK'
              }).then(() => {
                fetchPayments(paymentsInfo.name);
              });
          } else {
              Swal.fire({
                  title: "Success",
                  text: `Transactions Successfully Recorded.`,
                  icon: 'success',
                  confirmButtonText: 'OK'
              }).then(() => {
                closeModal();
                fetchPayments(paymentsInfo.name);
              });
          }
        }
      });
    };
    
    // Overlay component
    const overlay = (
        <div className="overlay" onClick={closeModal}></div>
    );

    // Modal content
    const modal = (
        <div
          className="modal"
          style={{
            width: "80%",
            maxHeight: "70vh", // Set maximum height to 70% of viewport height
            overflowY: "auto", // Enable vertical scrolling when content overflows
            margin: "10px auto",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <h1
            style={{
              width: "50%",
              margin: "10px auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Transact Payments
          </h1>
          <h2 className='form-title'>Name: {paymentsInfo.name}</h2>
          <h2 className='form-title'>Total Amount: {paymentsInfo.total_value}</h2>
          <div
            style={{
              maxHeight: "50vh", // Set height limit for table wrapper
              overflowY: "auto", // Enable vertical scroll
              overflowX: "auto", // Enable horizontal scroll if necessary
            }}
          >
            <table
              style={{
                width: "90%",
                margin: "20px auto",
                borderCollapse: "collapse", // Merge table borders
              }}
            >
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
                {paymentsInfo.transactions.map((transactionInfo, index) => {
                  return (
                    <tr key={index}>
                      <td className='modal-table-cell'>
                        <input type="text" name="student-id" value={transactionInfo.student_id} className="form-control" readOnly/>
                      </td>
                      <td className='modal-table-cell'>
                        <input type="text" name="student_name" value={transactionInfo.student_name} className="form-control" readOnly/>
                      </td>
                      <td className='modal-table-cell'>
                        <textarea name="transaction-message" id="transaction-message"
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
          <div className='button-area'>
            <button onClick={transactPayments} id='ok-button'>
                      OK
                  </button>
            <button onClick={closeModal} id='cancel-button'>
                Close
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