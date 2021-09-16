import React, { useEffect, useRef } from 'react';
import { BarChart } from '../Other/chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function QosChart(props){
  const qosChartRef = useRef(null)
  const chartCanvasRef = React.createRef()
  $.fn.dataTable.ext.errMode = 'none';
  console.log(props.queue)
  
  useEffect(() => {
    if(qosChartRef.current !== null){
      qosChartRef.current.data.datasets[0].data = [parseInt(props.queue.rate) / 1000]
      qosChartRef.current.data.labels = ['Mbps']
      qosChartRef.current.update()
    }
  }, [props.queue])

  useEffect(() => {
      let qosChart = BarChart(chartCanvasRef.current.getContext('2d'), parseInt(props.queue.rate));
      qosChartRef.current = qosChart
    }, [])

  return  <div className="card bg-dark">
                <div className="card-body">
                <h6 class="card-title text-center" style={{textDecorationLine: 'underline'}}>{props.queue['queue-name']}</h6>
                <canvas ref={chartCanvasRef} style={{height: "200px"}}/>
                </div>
              </div>
  }

  