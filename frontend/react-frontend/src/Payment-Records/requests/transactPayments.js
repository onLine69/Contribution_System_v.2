import Swal from "sweetalert2";

export default async function transactPayments(setPaymentTransactions,selectedContribution, showModal){
    const toBeTransact = Array.from(document.querySelectorAll('input[name="transact-student"]:checked'))
    .filter(transact => !transact.disabled); // Filter out disabled checkboxes

    if (toBeTransact.length > 0){
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
            "name": selectedContribution.name,
            "amount": selectedContribution.amount,
            "students_count": transactionList.length,
            "total_value": selectedContribution.amount * transactionList.length,
            "transactions": transactionList,
            setPaymentTransactions: setPaymentTransactions
        };
        setPaymentTransactions(transactionsInfo);
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