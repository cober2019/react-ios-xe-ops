import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from '../Other/errorBoundry';
import { QosChart } from './qosCharts';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Qos(props){
  const [update, setUpdate] = useState(0)
  $.fn.dataTable.ext.errMode = 'none';
  console.log(props.qos)
  
  useEffect(() => {
    let render = update + 1
    setUpdate(render)
}, [props.qos])

  useEffect(() => {
      let render = update + 1
      setUpdate(render)
  }, [])

 if(Array.isArray(props.qos)){
        return  <div className="row">
                  <h5 class="card-title mt-3">{props.interface.name}</h5>
                      { props.qos.map(queue => (
                        <div className="row">
                          <h5 class="card-title mt-3">Allocation: {queue.allocation[0]}{queue.allocation[1]}</h5>
                          <div className="row">
                            {
                            queue.queues.map(queueDetails => 
                              <div className="col-2">
                                <ErrorBoundary>
                                    <QosChart queue={queueDetails}/>
                                </ErrorBoundary>
                              </div>
                          )}
                          </div>
                          </div>
                        ))}
                </div>

  }
  else{
    return  <div className="row">
      <h5 class="card-title mt-3">{props.interface.name}</h5>
      <h6 class="card-title mt-3">Allocation: {props.qos.allocation}</h6>
      <div className="row">
        { props.qos.queues.map(queueDetails => (
          <div className="col-2">
            <ErrorBoundary>
                <QosChart queue={queueDetails}/>
            </ErrorBoundary>
          </div>
        ))}
      </div>
  </div>
  }
  }
  