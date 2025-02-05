import { useEffect, useState } from "react";


import FilterArea from "./FIlter-Area.jsx";
import GraphArea from "./Graph-Area.jsx";
import OptionsArea from "./Options-Area.jsx"

import fetchAcademicYear from "../fetchAcademicYear.js";
import fetchProgramCodes from "../fetchProgramCodes.js";

import "./Dashboard.css";

export default function Dashboard() {
  const [filterParams, setFilterParams] = useState({
    programFilter: '',
    yearFilter: '',
    monthFilter: ''
  });
  const [programCodes, setProgramCodes] = useState([]);
  const [years, setYears] = useState([]);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    async function fetchData() {
        const thisAcademicYear = await fetchAcademicYear();        
        setYears(separateAY(thisAcademicYear));
    }

    fetchData();
    fetchProgramCodes(setProgramCodes);
  }, []);

  useEffect(() => {
    console.log("Filter Params:", filterParams);
    if ((filterParams.programFilter !== '') && (filterParams.yearFilter !== '') && (filterParams.monthFilter !== '')) {
      setShowGraph(true);
    } else {
      setShowGraph(false);
    }
  }, [filterParams]);

  const filterArea = (
    <div 
    style={{
      width: "80%",
      height: "20%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",        
      position: "sticky",
      top: "100px",
      zIndex: "1000",
      backgroundColor: "#F4F5FF",
      margin: "0px auto"
    }}
    >
      <FilterArea programCodes={programCodes} years={years} months={months} setFilterParams={setFilterParams} />
      <OptionsArea />
    </div>
    
  );

  return (
    <>
    {filterArea}
    {showGraph && <GraphArea filter_data={filterParams} showGraph={showGraph}/>}
    </>
  );
}


function separateAY(academic_year) {
  console.log("Here:", academic_year.academic_year);
  return academic_year.academic_year.split("-");
}