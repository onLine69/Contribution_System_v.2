import Swal from 'sweetalert2'

export default async function recordPayments(paymentsInfo, fetchPayments, setters, closeModal){
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
              fetchPayments(paymentsInfo.name, setters);
            });
        } else {
            Swal.fire({
                title: "Success",
                text: `Transactions Successfully Recorded.`,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
              closeModal();
              fetchPayments(paymentsInfo.name, setters);
            });
        }
      }
    });
  };