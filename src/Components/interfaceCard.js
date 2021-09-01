import React, { useEffect, useRef } from 'react';
import { InitialChartBuild, UpdateChart, ArpTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export  function InterfaceCard(props){
  const interfacesChart = useRef(null)
  const interfacesRef = React.createRef()
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(interfacesChart.current !== null){
      let updatedChart = UpdateChart(interfacesChart.current, parseInt(props.value['statistics']['tx-kbps']),parseInt(props.value['statistics']['rx-kbps']));
      updatedChart.update()
      interfacesChart.current = updatedChart
    }
    
  }, [props.value])
  

  useEffect(() => {
      let chart = InitialChartBuild(interfacesRef.current.getContext('2d'), parseInt(props.value['statistics']['tx-kbps']), parseInt(props.value['statistics']['rx-kbps']));
      interfacesChart.current = chart
  }, [])

  
  return <div className="col-xl-4">
            <div className="card text-white bg-dark mt-3 border-0">
                      <div className="card-body">
                      <h4 class="card-title text-center">{props.value.name}</h4>
                      <br/>
                      <div className="row">
                        <canvas ref={interfacesRef} heistyle={{height: "100px"}}/>
                      </div>
                      <br/>
                          <div className="row">
                            <div className="col-6">
                              <p className="card-text">Speed: {Math.round(parseInt(props.value.speed) / 1000000000) * 1000 } (Mbps)</p>
                              <p className="card-text">Status: {props.value['oper-status']}</p>
                              <p className="card-text">IP: {props.value.ipv4}-{props.value['ipv4-subnet-mask']}</p>
                              <p className="card-text">Descr: {props.value.description}</p>
                              <p className="card-text">MTU: {props.value.mtu}</p>
                              <p className="card-text">Mbps Out: {props.value['statistics']['tx-kbps']}</p>
                              <p className="card-text">Mbps In: {props.value['statistics']['rx-kbps']}</p>
                              <p className="card-text">PPs Out: {props.value['statistics']['rx-pps']}</p>
                              <p className="card-text">PPs In: {props.value['statistics']['tx-pps']}</p>
                            </div>
                            <div className="col-6">
                              <p className="card-text">InDis: {props.value['statistics']['in-discards']}</p>
                              <p className="card-text">OutDis: {props.value['statistics']['out-discards']}</p>
                              <p className="card-text">InErr: {props.value['statistics']['in-errors']}</p>
                              <p className="card-text">InDis: {props.value['statistics']['out-errors']}</p>
                              <p className="card-text">CRC: {props.value['statistics']['in-crc-errors']}</p>
                              <p className="card-text">InDis: {props.value['statistics']['num-flaps']}</p>
                              <p className="card-text">LastChange: {props.value['statistics']['discontinuity-time'].split('.')[0]}</p>
                              <p className="card-text">Qos/Direction: {props.qos['policy']} - {props.qos['direction']}</p>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
  }
  