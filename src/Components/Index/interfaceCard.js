import React, { useEffect, useRef } from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { InitialChartBuild, UpdateChart } from '../Other/chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export  function InterfaceCard(props){
  const interfacesChart = useRef(null)
  const interfacesRef = React.createRef()
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


return      <div><Row>
              <canvas ref={interfacesRef} height="300px"/>
            </Row>
            <br/>
              <Row div className="row">
                  <Col xl={6}>
                    <p className="card-text">Speed: {Math.round(parseInt(props.value.speed) / 1000000000) * 1000 } (Mbps)</p>
                    <p className="card-text">Status: {props.value['oper-status']}</p>
                    <p className="card-text">IP: {props.value.ipv4}-{props.value['ipv4-subnet-mask']}</p>
                    <p className="card-text">Descr: {props.value.description}</p>
                    <p className="card-text">MTU: {props.value.mtu}</p>
                    <p className="card-text">Mbps Out: {props.value['statistics']['tx-kbps']}</p>
                    <p className="card-text">Mbps In: {props.value['statistics']['rx-kbps']}</p>
                    <p className="card-text">PPs Out: {props.value['statistics']['rx-pps']}</p>
                    <p className="card-text">PPs In: {props.value['statistics']['tx-pps']}</p>
                  </Col>
                  <Col xl={6}>
                    <p className="card-text">InDis: {props.value['statistics']['in-discards']}</p>
                    <p className="card-text">OutDis: {props.value['statistics']['out-discards']}</p>
                    <p className="card-text">InErr: {props.value['statistics']['in-errors']}</p>
                    <p className="card-text">InDis: {props.value['statistics']['out-errors']}</p>
                    <p className="card-text">CRC: {props.value['statistics']['in-crc-errors']}</p>
                    <p className="card-text">InDis: {props.value['statistics']['num-flaps']}</p>
                    <p className="card-text">LastChange: {props.value['statistics']['discontinuity-time'].split('.')[100]}</p>
                    <p className="card-text">Qos/Direction: {props.qos['policy']} - {props.qos['direction']}</p>
                  </Col>
                </Row>
                </div>

  }
  