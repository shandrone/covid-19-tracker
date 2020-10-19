import React, { useEffect, useState } from 'react'
import {Line} from "react-chartjs-2"
import numeral from "numeral"


const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesTypes='cases') => {
    let chartData = [];        
    let lastDataPoint;

    for(let date in data.cases) {
        if (lastDataPoint){
            const newDataPoint = {
                x:date,
                y:data[casesTypes][date] - lastDataPoint
            }
            chartData.push(newDataPoint);
            
        }
        lastDataPoint = data[casesTypes][date];
    }
    return chartData;
}

function LineGraph({casesTypes = 'cases', ...props}) {
    const [data, setData] = useState({}); 
    
    useEffect(() => {
        const fetchData = async () => {
            await  fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=30')
            .then((response) => {
                return response.json();})
            .then((data) => {                
                let chartData = buildChartData(data, casesTypes);
                setData(chartData);   
            })
        }
        fetchData()       
    }, [casesTypes]);

    
    return (
        <div className = {props.className}>
          {data?.length > 0 && (
            <Line
              data={{
                datasets: [
                  {
                    backgroundColor: "rgba(204, 16, 52, 0.5)",
                    borderColor: "#CC1034",
                    data: data,
                  },
                ],
              }}
              options={options}
            />
          )}
        </div>
      );
}

export default LineGraph
