export default function FilterArea({ programCodes, years, months, setFilterParams }) {
    const dropdownStyle = {
        width: "30%",
        margin: "10px auto",
        height: "30px",
        borderRadius: "8px"
    };

    return (
        <div id="filter-records" 
        style={{
            width: "70%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            border: "black solid 1px",
            padding: "20px",
            margin: "0px auto",
        }}
        >
            <div>
                <h3 className="card-title">Filter List</h3>
            </div>
            <div 
            style={{
                display: "flex",
                flexDirection: "row",
                width: "100%"
            }}
            >
                <select name="filter-program" id="filter-program" style={dropdownStyle} title="Filter Program Code" 
                    onChange={(e) => {setFilterParams((params) => {return {...params, programFilter: e.target.value}})}}>
                    <option value=''>Select Program</option>
                    { programCodes.map((code, index) => {
                        return <option key={index} value={code}>{code}</option>;
                    }) }
                </select>
                <select name="filter-year" id="filter-year" style={dropdownStyle} title="Filter Year" 
                    onChange={(e) => {setFilterParams((params) => {return {...params, yearFilter: e.target.value}})}}>
                    <option value=''>Select Year</option>
                    { years.map((year, index) => {
                        return <option key={index} value={year}>{year}</option>;
                    }) }
                </select>
                <select name="filter-month" id="filter-status" style={dropdownStyle} title="Filter Month" 
                    onChange={(e) => {setFilterParams((params) => {return {...params, monthFilter: e.target.value}})}}>
                    <option value=''>Select Month</option>
                    { months.map((month, index) => {
                        return <option key={index} value={index + 1}>{month}</option>;
                    }) }
                </select>
            </div>
        </div>
    );
}