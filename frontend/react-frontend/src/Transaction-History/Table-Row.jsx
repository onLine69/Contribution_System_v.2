export default function TableRow({ history }) {
  return (
    <tr style={{ width: "100%" }}>
      <td>{history.id}</td>
      <td>{history.datetime}</td>
      <td>{history.id_number}</td>
      <td>{history.full_name}</td>
      <td>{history.payment_mode}</td>
      <td>{history.status}</td>
      <td
        style={{
          width: history.transaction_message !== "".trim() ? "30%" : "auto",
        }}
      >
        {history.transaction_message}
      </td>
    </tr>
  );
}
