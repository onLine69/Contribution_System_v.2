export default function TableHeader() {
  return (
    <thead>
      <tr>
        <th scope="col">
          <input
            type="checkbox"
            id="transact-all"
            onClick={(e) => {
              selectAllStudents(e.target.checked);
            }}
          />
        </th>
        <th scope="col">Name</th>
        <th scope="col">ID Number</th>
        <th scope="col">Balance</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
  );
}

function selectAllStudents(isChecked) {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"][name="transact-student"]'
  );
  checkboxes.forEach((checkbox) => {
    if (!checkbox.disabled) {
      // Only change the state of enabled checkboxes
      checkbox.checked = isChecked;
    }
  });
}
