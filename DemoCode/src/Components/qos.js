import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './errorBoundry';
import { QosChart } from './qosCharts';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Qos(props){
  const [update, setUpdate] = useState(0)
  $.fn.dataTable.ext.errMode = 'none';
  
  useEffect(() => {
    let render = update + 1
    setUpdate(render)
}, [props.qos])

  useEffect(() => {
    console.log(props.qos)
      let render = update + 1
      setUpdate(render)
  }, [])

  return  <div className="row">
                <h5 class="card-title mt-3">GigabitEthernet0 | {props.value.policy} | {props.value.direction} | 1000 Mbps</h5>
                { props.value.queues.map(queue => 
                    <div className="col-sm">
                    <ErrorBoundary>
                        <QosChart queue={queue} policy={props.value.policy} direction={props.value.direction}/>
                    </ErrorBoundary>
                    </div>
                )}
    </div>
  }
  