export default function TableRow({ payment }) {
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          name="transact-student"
          data-number={payment.number}
          value={payment.id_number}
          disabled={payment.balance === 0 || payment.status === "Pending"}
        />
      </td>
      <td>{payment.full_name}</td>
      <td>{payment.id_number}</td>
      <td>{payment.balance}</td>
      <td>{payment.status}</td>
    </tr>
  );
}
