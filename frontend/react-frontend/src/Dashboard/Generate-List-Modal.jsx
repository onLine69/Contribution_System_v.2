import generateStudentList from "./requests/generateStudentList.js";

export default function GenerateListModal({ isOpen, closeModal }) {
  // Overlay component
  const overlay = <div className="overlay" onClick={closeModal}></div>;

  const modal = (
    <div className="list-modal">
      <h1>Generate Students List</h1>
      <div className="form">
        <div className="form-group">
          <select
            name="filter-program"
            id="filter-program"
            className="form-input"
            title="Filter Program Code"
            onChange={(e) => {
              generateStudentList(e.target.value);
            }}
          >
            <option value="None">--Select List--</option>
            <option value="All">All Students</option>
            <option value="Paid">Paid Students</option>
            <option value="Unpaid">Unpaid Students</option>
          </select>
        </div>
      </div>
    </div>
  );

  return isOpen ? (
    <>
      {overlay}
      {modal}
    </>
  ) : null;
}
