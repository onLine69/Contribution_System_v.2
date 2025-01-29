export default function FilterArea({ programCodes, setFilterParams }) {
    return (
        <div id="filter-records" className="card">
            <h3 className="card-title">Filter List</h3>
            <select name="filter-program" id="filter-program" className="filter-selection" title="Filter Program Code" 
                onChange={(e) => {setFilterParams((params) => {return {...params, programFilter: e.target.value}})}}>
                <option value="All">Display All Program</option>
                { programCodes.map((code, index) => {
                    return <option key={index} value={code}>{code}</option>;
                }) }
            </select>
            <select name="filter-year" id="filter-year" className="filter-selection" title="Filter Year Level" 
                onChange={(e) => {setFilterParams((params) => {return {...params, yearFilter: e.target.value}})}}>
                <option value={0}>Display All Year</option>
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
            </select>
        </div>
    );
}