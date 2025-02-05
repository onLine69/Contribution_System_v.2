import { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";

import fetchData from "./fetchData.js";
import generateChartPDF from "./generateChartPDF.js";

export default function GraphArea(filter_data, showGraph) {
  const [chartData, setChartData] = useState(null);
  const [lineCharts, setLineCharts] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchData(
            filter_data.filter_data.programFilter,
            filter_data.filter_data.yearFilter,
            filter_data.filter_data.monthFilter
        );
        setChartData(data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    }

    getData();
  }, [filter_data]);
  
  useEffect(() => {
    if (!chartData) return;

    const xValues = ["1st", "2nd", "3rd", "4th"];
    const graphStyles = {
      maxWidth: "45%",
      maxHeight: "100%"
    };
    const charts = (
      <div 
      style={{
        width: "100%", 
        height: "70%",
        display: "flex", 
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        margin: "0px auto"
      }}
      >
        <Line className="graph-report"
          style={graphStyles}
          data={{
            labels: xValues,
            datasets: [
              {
                label: "Paid",
                data: chartData.paid.first,
                backgroundColor: "blue",
                borderColor: "blue"
              },
              {
                label: "Unpaid",
                data: chartData.unpaid.first,
                backgroundColor: "red",
                borderColor: "red"
              }
            ]
          }}
          options={{
            elements: {
              line: {
                tension: 0.5
              },
            },
            plugins: {
              title: {
                display: true,
                align: "center",
                text: `${chartData.names.first} (${filter_data.filter_data.programFilter})`
              }
            }
          }}
          />

        <Line className="graph-report"
          style={graphStyles}
          data={{
            labels: xValues,
            datasets: [
              {
                label: "Paid",
                data: chartData.paid.second,
                backgroundColor: "blue",
                borderColor: "blue"
              },
              {
                label: "Unpaid",
                data: chartData.unpaid.second,
                backgroundColor: "red",
                borderColor: "red"
              }
            ]
          }}
          options={{
            elements: {
              line: {
                tension: 0.5
              },
            },
            plugins: {
              title: {
                display: true,
                align: "center",
                text: `${chartData.names.second} (${filter_data.filter_data.programFilter})`
              }
            }
          }}
          />
      </div>
    );

    setLineCharts(charts);
  }, [chartData]);

  return ( showGraph ? 
    <div className="graph-area" 
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-evenly",
      width: "100%",
      height: "calc(100vh - 300px)",
      margin: "0px auto",
      gap: "5px"
    }}>
      {lineCharts}
      
      <button className="generate-pdf-btn" type="button" onClick={() => generateChartPDF(filter_data.filter_data, {paid: chartData.paid, unpaid: chartData.unpaid })}>
        Generate Graphs in PDF
      </button>
    </div> : null
  );
}
