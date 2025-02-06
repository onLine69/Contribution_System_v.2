export default function TableRow({ verify }) {
  const parsedDateTime = new Date(verify.datetime);
  const formattedDate = parsedDateTime
    .toISOString()
    .replace("T", " ")
    .slice(0, 19);

  return (
    <tr style={{ width: "100%" }}>
      <td>
        <input
          type="checkbox"
          name="verify-payment"
          data-number={verify.number}
          value={verify.id_number}
          onClick={(e) => {
            const number = e.target.dataset.number; // Access the data-number attribute
            if (e.target.checked) console.log(number); // Log or use the value as needed
          }}
        />
      </td>
      <td>{verify.id}</td>
      <td>{formattedDate}</td>
      <td>{verify.id_number}</td>
      <td>{verify.full_name}</td>
      <td>{verify.payment_mode}</td>
      <td
        style={{
          width: verify.transaction_message !== "".trim() ? "30%" : "auto",
        }}
      >
        {verify.transaction_message}
      </td>
    </tr>
  );
}
