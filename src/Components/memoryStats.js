import React, { useState, useEffect } from 'react';
import { UpdatehwdChart, InitialhwdChartBuild } from './chartConfigs';
import { GetHwdStatus } from './promises';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export function MemoryStats(props){
    const [chart, setChart] = useState(undefined)
    const [hwdStats, sethwdStats] = useState(undefined)
    const [hwdTableRef, sethwdTableRef] = useState(React.createRef())
    const [proccessTableStatus, setproccessTableStatus] = useState(false)
    const [proccessRef, setcapabilitiesRef] = useState(React.createRef())
    const [chartStatus, setChartStatus] = useState(false)

    useEffect(() => {
        ( async () => {
            if(chart !== undefined){
                while(props.auth){
                    try{
                        let hwd = await GetHwdStatus(props.ip, props.username, props.password, props.port)
                        sethwdStats(hwd)
                    }
                    catch{}
                }
            }
          }) ();
      }, [chartStatus])
    
      useEffect(() => {
        ( async () => {
          if(chartStatus !== true){
            let hwd = await GetHwdStatus(props.ip, props.username, props.password, props.port)
            console.log(hwd)
            sethwdStats(hwd)
            setChartStatus(true)
            }
          }) ();
      }, [])
      
     
    if(hwdStats !== undefined){
        return <div  className="col-12">
                    <div className="card text-white bg-dark">
                        <div className="card-body">
                            <h4 class="card-title">hwd Statistics</h4>
                        </div>
                    </div>
                </div>
            }
            else{
                return <div  className="col-12">
                <div className="card text-white bg-dark">
                    <div className="card-body">
                        <h4 class="card-title">hwd Statistics</h4>
                    </div>
                </div>
            </div>
            } 
        }
        
  