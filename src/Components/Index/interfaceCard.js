import React, { useEffect, useRef } from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { InitialChartBuild, UpdateChart } from '../Other/chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export  function InterfaceCard(props){
  const interfacesChart = useRef(null)
  const interfacesRef = React.createRef()
  const interfaceNameRef = React.createRef(props.value.name)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(interfacesChart.current !== null){
      try{
        let updatedChart = UpdateChart(interfacesChart.current, parseInt(props.value['statistics']['tx-kbps']),parseInt(props.value['statistics']['rx-kbps']));
        updatedChart.update()
        interfacesChart.current = updatedChart
      }
      catch{}
    }
    
  }, [props.value])
  

  useEffect(() => {
    try{
      let chart = InitialChartBuild(interfacesRef.current.getContext('2d'), parseInt(props.value['statistics']['tx-kbps']), parseInt(props.value['statistics']['rx-kbps']));
      interfacesChart.current = chart
    }
    catch{}
  }, [])


return      <div id={props.value.name}>
            <Row>
              <canvas ref={interfacesRef} height="300px"/>
            </Row>
            <br/>
              <Row>
                  <Col xl={3}>
                    <p className="card-text">Speed:</p>
                    <p className="card-text">Status:</p>
                    <p className="card-text">IP:</p>
                    <p className="card-text">MTU:</p>
                    <p className="card-text">Mbps Out:</p>
                    <p className="card-text">Mbps In:</p>
                    <p className="card-text">Mbps Out Diff:</p>
                    <p className="card-text">Mbps In Diff:</p>
                  </Col>
                  <Col xl={3}>
                    <p className="card-text">{Math.round(parseInt(props.value.speed) / 1000000000) * 1000 } (Mbps)</p>
                    <p className="card-text">{props.value['oper-status']}</p>
                    {props.value.ipv4 ? <p className="card-text">{props.value.ipv4}</p> : <p className="card-text">n/a</p>}
                    <p className="card-text">{props.value.mtu}</p>
                    <p className="card-text">{props.value['statistics']['tx-kbps']}</p>
                    <p className="card-text">{props.value['statistics']['rx-kbps']}</p>
                    <p className="card-text">{props.value.outbandwidthDiff}</p>
                    <p className="card-text">{props.value.inbandwidthDiff}</p>
                  </Col>
                  <Col xl={3}>
                    <p className="card-text">PPs Out:</p>
                    <p className="card-text">PPs In:</p>
                    <p className="card-text">InDis:</p>
                    <p className="card-text">OutDis:</p>
                    <p className="card-text">InErr:</p>
                    <p className="card-text">InDis:</p>
                    <p className="card-text">CRC:</p>
                    <p className="card-text">InDis:</p>

                  </Col>
                  <Col xl={3}>
                    <p className="card-text">{props.value['statistics']['rx-pps']}</p>
                    <p className="card-text">{props.value['statistics']['tx-pps']}</p>
                    <p className="card-text">{props.value['statistics']['in-discards']}</p>
                    <p className="card-text">{props.value['statistics']['out-discards']}</p>
                    <p className="card-text">{props.value['statistics']['in-errors']}</p>
                    <p className="card-text">{props.value['statistics']['out-errors']}</p>
                    <p className="card-text">{props.value['statistics']['in-crc-errors']}</p>
                    <p className="card-text">{props.value['statistics']['num-flaps']}</p>
                    
                  </Col>
                </Row>
                <Row>
                  <Col xl={3} className="mt-3">
                  <p className="card-text">Description:</p>
                    <p className="card-text">LastChange:</p>
                  </Col>
                  <Col xl={9} className="mt-3">
                  <p className="card-text">{props.value.description}</p>
                    <p className="card-text">{props.value['statistics']['discontinuity-time'].split('.')[0]}</p>
                  </Col>
                
                </Row>
                </div>

  }
  