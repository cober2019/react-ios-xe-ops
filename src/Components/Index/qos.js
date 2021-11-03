import React, { useState, useEffect, useRef } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ErrorBoundary } from  'react-error-boundary'
import { QosChart } from './qosCharts';
import { IsErrorFallback } from "../Other/errorComponent";
import { QosTopologyBuild, UpdateQosTopology } from './topology';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Qos(props){
  const qosTopologyRef = React.createRef()
  const qosTopology = useRef(null)
  $.fn.dataTable.ext.errMode = 'none';
  
  useEffect(() => {
      try{
        props.qos.map(queue => {
          qosTopology.current = UpdateQosTopology(qosTopology.current, queue, props.interface.data.name)
          qosTopologyRef.current =  qosTopology.current
        })
      }
      catch{}
  }, [props.qos])

  useEffect(() => {
    
    try{
      props.qos.map(queue => {
        qosTopology.current = QosTopologyBuild(qosTopologyRef.current, queue, props.interface.data.name)
        qosTopologyRef.current =  qosTopology.current
      })
    }
    catch{}

  }, [])

  return   <Row>
            { props.qos.map(queue => (
              <>
              <Row>
                <h5 classname="mt-3">{props.interface.data.name}<span> - Allocation: {queue.allocation} - Policy: {queue.interface_policy} - Direction: {queue.direction}</span></h5>
                <div ref={qosTopologyRef} className="bg-dark" style={{height: '500px'}}/>
              </Row>
              <Row>
                  {
                  queue.queues.map(queueDetails => 
                    <Col sm={2}>
                      <ErrorBoundary FallbackComponent={IsErrorFallback}>
                          <QosChart queue={queueDetails}/>
                      </ErrorBoundary>
                    </Col>
                  )}
              </Row>
                </>
              ))}
          </Row>

 
  }
  