import React, { useState, useEffect } from 'react';
import { InitialChartBuild, UpdateChart, TableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export  function InterfaceCard(props){
  const [chart, setChart] = useState(undefined)
  const [chartStatus, setChartStatus] = useState(false)
  const [arpCount, setArpCount] = useState(0)
  const [showArp, setShowArp]= useState(false)
  const interfacesRef = React.createRef()
  const arpTableRef = React.createRef()
  const table = TableHtml(arpTableRef)

  useEffect(() => {
    if(chart){
      let updatedChart = UpdateChart(chart, parseInt(props.value['statistics']['tx-kbps']),parseInt(props.value['statistics']['rx-kbps']));
      setChart(updatedChart)
      setArpCount(props.arps.length)
      updatedChart.update()
    }
    
  }, [props.arps])
  

  useEffect(() => {
    if(chartStatus !== true){
      var chart = InitialChartBuild(interfacesRef.current.getContext('2d'), parseInt(props.value['statistics']['tx-kbps']), parseInt(props.value['statistics']['rx-kbps']));
      setChart(chart)
      setArpCount(props.arps.length)
      setChartStatus(true)
      }

  }, [])

  
  const getArps = (value) => {

    if(value){
      $(arpTableRef.current).DataTable().destroy()
        if(props.arps.length !== 0)
          try{
            $(arpTableRef.current).DataTable({
              dom: 
              "<'row'<'col-sm-12'tr>>" +
              "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
              data: props.arps,
              pagingType: "full_numbers",
              columns:  [
                { data: 'address' },
                { data: 'hardware' },
                { data: 'mode' },
                { data: 'type' },
                { data: 'time' }
            ],
            fnRowCallback: function (nRow) {$(nRow).addClass('row-text')}});
          }
        catch{}

      setShowArp(true)
    }
    else{
      setShowArp(false)
    }
  }

  console.log(props.value)

  return  <div className="card text-white bg-dark" style={{marginTop: 10, height: '575px'}}>
              <div className="card-body">
              <h4 class="card-title">{props.value.name}</h4>
              <br/>
              {showArp ? <div onClick={(e) => getArps(false, e)} className="overlay">{table}</div>: 
              <div hidden>
              {table}
              </div>
              }
              <canvas ref={interfacesRef} style={{height: "100px"}}/>
              <br/>
                  <div className="row">
                    <div className="col-6">
                      <p className="card-text">Speed: {parseInt(props.value.speed) / 1e6 }</p>
                      <p className="card-text">Status: {props.value['oper-status']}</p>
                      <p className="card-text">IP: {props.value.ipv4}-{props.value['ipv4-subnet-mask']}</p>
                      <p className="card-text">Descr: {props.value.description}</p>
                      <p className="card-text">MTU: {props.value.mtu}</p>
                      <p className="card-text">Mbps Out: {parseInt(props.value['statistics']['tx-kbps']) / 1000}</p>
                      <p className="card-text">Mbps In: {parseInt(props.value['statistics']['rx-kbps']) / 1000}</p>
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
                      <a className="card-text" href="#" onClick={(e) => getArps(true, e)}>ARP Entries: <span style={{color: 'white'}}>{arpCount}</span></a>
                    </div>
                  </div>
              </div>
            </div>
  }
  