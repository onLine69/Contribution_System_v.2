export default function TableRow({ payment }) {

  return (
    <>
    <tr>
        <td>
            <input 
            type="checkbox" 
            name="transact-student" 
            data-number={payment.number} 
            value={payment.id_number} 
            disabled={payment.balance === 0 || payment.status === "Pending"}
            onClick={(e) => {
                const number = e.target.dataset.number; // Access the data-number attribute
                if (e.target.checked) console.log(number); // Log or use the value as needed
            }}
            />
        </td>
        <td>{payment.full_name}</td>
        <td>{payment.id_number}</td>
        <td>{payment.balance}</td>
        <td>{payment.status}</td>
    </tr>
    </>
  );
}
