export default function FilterRange({ dateTimeRange, setDateTimeRange }) {
  return (
    <div id="filter-records" className="card">
      <h3 className="card-title">Filter Range</h3>

      {/* Start Date-Time */}
      <label htmlFor="start-range">Select Start Date-Time:</label>
      <input
        type="datetime-local"
        name="start-range"
        id="start-range"
        className="filter-selection"
        value={dateTimeRange.start}
        style={{ textAlign: "center"}}
        onChange={(e) =>
          setDateTimeRange({ ...dateTimeRange, start: e.target.value })
        }
      />

      {/* End Date-Time */}
      <label htmlFor="end-range">Select End Date-Time:</label>
      <input
        type="datetime-local"
        name="end-range"
        id="end-range"
        className="filter-selection"
        value={dateTimeRange.end}
        style={{ textAlign: "center"}}
        onChange={(e) =>
          setDateTimeRange({ ...dateTimeRange, end: e.target.value })
        }
      />
    </div>
  );
}
