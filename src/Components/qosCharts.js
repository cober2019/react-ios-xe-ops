import React, { useState, useEffect } from 'react';
import { BarChart, BarChartUpdate } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function QosChart(props){
  const [chart, setChart] = useState(false)
  const qosChartRef = React.createRef()
  $.fn.dataTable.ext.errMode = 'none';
  
  useEffect(() => {
    if(chart){
      chart.data.datasets[0].data = [parseInt(props.queue.rate) / 1000]
      chart.data.labels = ['Mbps']
      setChart(chart)
      chart.update()
    }
  }, [props.queue])

  useEffect(() => {
      if(!chart){
        var chart = BarChart(qosChartRef.current.getContext('2d'), parseInt(props.queue.rate)
        );
        setChart(chart)
      }
    }, [])

  return  <div className="card bg-dark">
                <div className="card-body">
                <h6 class="card-title text-center" style={{textDecorationLine: 'underline'}}>{props.queue['queue-name']}</h6>
                <canvas ref={qosChartRef} style={{height: "200px"}}/>
                </div>
              </div>
  }

  