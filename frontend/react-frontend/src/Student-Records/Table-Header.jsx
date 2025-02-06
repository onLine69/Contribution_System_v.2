export default function TableHeader({ filteredStudentslength }) {
  return (
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">Name</th>
        <th scope="col">ID Number</th>
        <th scope="col">Gender</th>
        <th scope="col">Year</th>
        <th scope="col">Program</th>
        <th scope="col">Note</th>
        <th scope="col" colspan="2">
          Number of Students = {filteredStudentslength}
        </th>
      </tr>
    </thead>
  );
}
