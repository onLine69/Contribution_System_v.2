export default function FilterArea({
  programCodes,
  years,
  months,
  setFilterParams,
}) {

  return (
    <div id="filter-dashboard-records">
      <div>
        <h3 className="card-title">Filter Data to Chart</h3>
      </div>
      <div className="filters">
        <select
          name="filter-program "
          id="filter-program"
          className="dropdowns"
          title="Filter Program Code"
          onChange={(e) => {
            setFilterParams((params) => {
              return { ...params, programFilter: e.target.value };
            });
          }}
        >
          <option value="">Select Program</option>
          {programCodes.map((code, index) => {
            return (
              <option key={index} value={code}>
                {code}
              </option>
            );
          })}
        </select>
        <select
          name="filter-year "
          id="filter-year"
          className="dropdowns"
          title="Filter Year"
          onChange={(e) => {
            setFilterParams((params) => {
              return { ...params, yearFilter: e.target.value };
            });
          }}
        >
          <option value="">Select Year</option>
          {years.map((year, index) => {
            return (
              <option key={index} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        <select
          name="filter-month"
          id="filter-status"
          className="dropdowns"
          title="Filter Month"
          onChange={(e) => {
            setFilterParams((params) => {
              return { ...params, monthFilter: e.target.value };
            });
          }}
        >
          <option value="">Select Month</option>
          {months.map((month, index) => {
            return (
              <option key={index} value={index + 1}>
                {month}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
