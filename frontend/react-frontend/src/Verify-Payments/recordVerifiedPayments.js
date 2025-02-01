import Swal from 'sweetalert2'
import showReceiptPage from "./showReceiptPage";

export default async function recordVerifiedPayments(receiptDetails, closeModal, fetchVerify, setters){
    Swal.fire({
        title: "Do you want to verify these payments?",
        text: "Double check the information provided. Once verified, it cannot be undone.",
        showCancelButton: true,
        confirmButtonText: "Verify",
        cancelButtonText: `Don't verify`
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const paymentsInfo = {
              name: receiptDetails.contribution_name,
              academic_year: receiptDetails.academic_year,
              amount: receiptDetails.amount,
              payments: receiptDetails.verified_payments
          };
  
          console.log(receiptDetails);
          const response = await fetch("http://127.0.0.1:5000/verify-payments/verify", 
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
                  fetchVerify(paymentsInfo.name, setters);
              });
          } else {
              showReceiptPage(receiptDetails);
              Swal.fire({
                  title: "Success",
                  text: `Transactions Successfully Recorded.`,
                  icon: 'success',
                  confirmButtonText: 'OK'
              }).then(() => {
                closeModal();
                fetchVerify(paymentsInfo.name, setters);
              });
          }
        }
      });    
    
};