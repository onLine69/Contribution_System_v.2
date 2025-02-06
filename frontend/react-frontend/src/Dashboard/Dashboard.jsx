import { useEffect, useState } from "react";

import FilterArea from "./FIlter-Area.jsx";
import GraphArea from "./Graph-Area.jsx";
import OptionsArea from "./Options-Area.jsx";

import fetchAcademicYear from "../fetchAcademicYear.js";
import fetchProgramCodes from "../fetchProgramCodes.js";

import "./Dashboard.css";

export default function Dashboard() {
  const [filterParams, setFilterParams] = useState({
    programFilter: "",
    yearFilter: "",
    monthFilter: "",
  });
  const [programCodes, setProgramCodes] = useState([]);
  const [years, setYears] = useState([]);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const thisAcademicYear = await fetchAcademicYear();
      setYears(thisAcademicYear.academic_year.split("-"));
    }

    fetchData();
    fetchProgramCodes(setProgramCodes);
  }, []);

  useEffect(() => {
    if (
      filterParams.programFilter !== "" &&
      filterParams.yearFilter !== "" &&
      filterParams.monthFilter !== ""
    ) {
      setShowGraph(true);
    } else {
      setShowGraph(false);
    }
  }, [filterParams]);

  const operationsArea = (
    <div className="operations-area">
      <FilterArea
        programCodes={programCodes}
        years={years}
        months={months}
        setFilterParams={setFilterParams}
      />
      <OptionsArea />
    </div>
  );

  return (
    <>
      {operationsArea}
      {showGraph && (
        <GraphArea filter_data={filterParams} showGraph={showGraph} />
      )}
    </>
  );
}
