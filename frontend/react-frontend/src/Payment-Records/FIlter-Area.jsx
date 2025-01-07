export default function FilterArea({ programCodes, controls }) {
    const display_status = ["All", "Unpaid", "Pending", "Paid"];

    return (
        <div id="filter-records" className="card">
            <h3 className="card-title">Filter List</h3>
            <select name="filter-program" id="filter-program" className="filter-selection" title="Filter Program Code" onChange={(e) => {controls.setSelectedPCode(e.target.value)}}>
                <option value="All">Display All Program</option>
                { programCodes.map((code, index) => {
                    return <option key={index} value={code}>{code}</option>;
                }) }
            </select>
            <select name="filter-year" id="filter-year" className="filter-selection" title="Filter Year Level" onChange={(e) => {controls.setSelectedYear(e.target.value)}}>
                <option value={0}>Display All Year</option>
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
            </select>
            <select name="filter-status" id="filter-status" className="filter-selection" title="Filter Status" onChange={(e) => {controls.setSelectedStatus(e.target.value)}}>
                { display_status.map((status, index) => {
                    return <option key={index} value={status}>{status}</option>;
                }) }
            </select>
        </div>
    );
}