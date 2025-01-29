export default function TableHeader() {
    return (
        <thead>
            <tr>
                <th scope="col"><input type="checkbox" id="verify-all" onClick={(e)=>{selectAllStudents(e.target.checked)}}/></th>
                <th scope="col">Transaction ID</th>
                <th scope="col">Date and Time</th>
                <th scope="col">Student ID</th>
                <th scope="col">Name</th>
                <th scope="col">Payment Mode</th>
                <th scope="col">Note</th>
            </tr>
        </thead>
    );
}


function selectAllStudents(isChecked){
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="verify-payment"]');
    checkboxes.forEach((checkbox) => {
        if (!checkbox.disabled) {  // Only change the state of enabled checkboxes
            checkbox.checked = isChecked;
        }
    });
}