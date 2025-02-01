import Swal from "sweetalert2";

export default async function verifyPayments(setVerifyTransactions, selectedContribution, showModal){
    const toBeVerified = Array.from(document.querySelectorAll('input[name="verify-payment"]:checked'))
    .filter(payment => !payment.disabled); // Filter out disabled checkboxes

    if (toBeVerified.length > 0){
        const paymentList = [];
        toBeVerified.forEach((transact) => {
            const row = transact.closest('tr');
            const studentId = row.querySelector('td:nth-child(4)').textContent; // Get Student ID
            const studentName = row.querySelector('td:nth-child(5)').textContent; // Get Student Name
            const studentNote = "";

            const transactionInfo = {
                "student_id": studentId,
                "student_name": studentName,
                "student_note": studentNote
            }

            paymentList.push(transactionInfo);
        });

        const transactionsInfo = {
            "name": selectedContribution.name,
            "amount": selectedContribution.amount,
            "payments_count": paymentList.length,
            "total_value": selectedContribution.amount * paymentList.length,
            "payments": paymentList,
            setVerifyTransactions: setVerifyTransactions
        };
        setVerifyTransactions(transactionsInfo);
        showModal();
    } else {
        Swal.fire({
            title: "No Record Selected.",
            text: `Please select a record/s to be transacted.`,
            icon: 'warning',
            confirmButtonText: 'OK'
        });
    }
}