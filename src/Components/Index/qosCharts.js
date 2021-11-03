import React, { useEffect, useRef } from 'react';
import { BarChart, BarChartUpdate } from '../Other/chartConfigs';
import { CreateCard } from '../Other/jsxCard';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function QosChart(props){
  const qosChartRef = useRef(null)
  const chartCanvasRef = React.createRef()
  $.fn.dataTable.ext.errMode = 'none';
  
  useEffect(() => {
    try{
      let updatedChart = BarChartUpdate(qosChartRef.current, [parseInt(props.queue.rate)]);
      updatedChart.update()
      chartCanvasRef.current = updatedChart
    }
    catch{}
    
  }, [props.queue])

  useEffect(() => {
      let qosChart = BarChart(chartCanvasRef.current.getContext('2d'), parseInt(props.queue.rate));
      qosChartRef.current = qosChart
    }, [])

  return  <>{CreateCard(<canvas ref={chartCanvasRef} height="200px"/>, '',<h6 classname="card-title text-center" style={{textDecorationLine: 'underline'}}>{props.queue['queue-name']}</h6>)}</>

  
  }

  