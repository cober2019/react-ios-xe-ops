import React, { useState, useEffect } from 'react';
import { GetInterface } from './promises'
import { InitialChartBuild, UpdateChart } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function ChartOverlay(props){
    const [chart, setChart] = useState(false)
    const interfacesRef = React.useRef(); 

    useEffect(() => {
        console.log(props.data)
        createChart()
      }, [props.data])

    const createChart = () => {
        setChart(<canvas ref={interfacesRef}/>)
        if (!chart){    
            var chart = InitialChartBuild(interfacesRef.current.getContext('2d'), "Mbps", "green", props.data);
        }
        else{
        console.log('yes')
        let updatedChart = UpdateChart(chart, props.data);
        updatedChart.update()
        setChart(updatedChart)
        }
    }

    return <div>
                <canvas ref={interfacesRef} style={{height: "100%", width:"100%"}} className="overlay" onClick={(e) => props.callback()}/>
            </div>
            
  }
    