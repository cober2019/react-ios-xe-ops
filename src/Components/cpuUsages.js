import React, { useState, useEffect } from 'react';
import { UpdateCpuChart, InitialCpuChartBuild, CpuTableHtml } from './chartConfigs';
import { GetCpuStatus } from './promises';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export function CpuUsage(props){
    const [chart, setChart] = useState(undefined)
    const [cpuStats, setcpuStats] = useState(undefined)
    const [cpuTableRef, setcpuTableRef] = useState(React.createRef())
    const [proccessTableStatus, setproccessTableStatus] = useState(false)
    const [proccessRef, setcapabilitiesRef] = useState(React.createRef())
    const [chartStatus, setChartStatus] = useState(false)
    const proccessTable = CpuTableHtml(proccessRef); 

    useEffect(() => {
        ( async () => {
            if(chart !== undefined){
                while(props.auth){
                    try{
                        let cpu = await GetCpuStatus(props.ip, props.username, props.password, props.port)
                        setcpuStats(cpu)
                        let updatedChart = UpdateCpuChart(chart, cpu.data.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']);
                        updatedChart.update()
                    }
                    catch{}
                }
            }
          }) ();
      }, [chartStatus])
    
      useEffect(() => {
        ( async () => {
          if(chartStatus !== true){
            let cpu = await GetCpuStatus(props.ip, props.username, props.password, props.port)
            console.log(cpu)
            setcpuStats(cpu)
            setChart(InitialCpuChartBuild(cpuTableRef.current.getContext('2d'), cpu.data.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']))
            setChartStatus(true)
            }
          }) ();
      }, [])
      
    const displayProccesses = (bool) =>{
        if(bool){
            if(proccessTableStatus === false){
                $(proccessRef.current).DataTable({
                    dom: "<\"top\"B><'col-sm-12'f>rt<\"bottom\"p><'col-sm-2'l>",
                    data: cpuStats.data.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['cpu-usage-processes']['cpu-usage-process'],
                    columns:  [
                        { data: 'name' },
                        { data: 'tty' },
                        { data: 'total-run-time' },
                        { data: 'invocation-count' },
                        { data: 'avg-run-time' },
                        { data: 'five-seconds' },
                        { data: 'one-minute' },
                        { data: 'five-minutes' }
                    ],});
                    setproccessTableStatus(true)
                }
            }
        else{
            $(proccessRef.current).DataTable().destroy()
            setproccessTableStatus(false)
        }
    }
    


    if(cpuStats !== undefined){
        return <div key={props.value} className="col-12">
                    <div className="card text-white bg-dark">
                        <div className="card-body">
                            <h4 class="card-title">CPU Statistics</h4>
                            <div className="row" style={{marginTop: '20px'}}>
                                <div className="col-8">
                                    <div className="row" style={{height: "200px"}}>
                                        <canvas ref={cpuTableRef} style={{height: "100%", marginLeft: '10px'}}/>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div class="table-responsive" style={{marginTop: '20px'}}>
                                        <table className="table table-borderless row-text">
                                            <thead class="thead-light">
                                                <tr>
                                                    <th style={{textAlign: 'center' }} scope="col">5 Sec</th>
                                                    <th style={{textAlign: 'center'}} scope="col">One Min</th>
                                                    <th style={{textAlign: 'center'}} scope="col">Five Min</th>
                                                    <th style={{textAlign: 'center'}} scope="col">Processes</th>
                                                    <th style={{textAlign: 'center'}} scope="col">Mem Usg.</th>
                                                </tr>
                                            </thead>  
                                            <tbody>
                                            <tr className="fade-in">
                                                <td style={{textAlign: 'center', fontSize: 40}}>{cpuStats.data.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']}</td>
                                                <td style={{textAlign: 'center', fontSize: 40}}>{cpuStats.data.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['one-minute']}</td>
                                                <td style={{textAlign: 'center', fontSize: 40}}>{cpuStats.data.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-minutes']}</td>
                                                <td href="#" style={{textAlign: 'center', fontSize: 40}}><a onClick={() => displayProccesses(true)} href="#">{cpuStats.data.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['cpu-usage-processes']['cpu-usage-process'].length}</a></td>
                                                <td style={{textAlign: 'center', fontSize: 40}}>{cpuStats.data.mem[0]['memory-stats']['available-percent']}<span style={{textAlign: 'center', fontSize: 10}}>({cpuStats.data.mem[0]['memory-stats']['memory-status']})</span></td>
                                            </tr>
                                            </tbody>                             
                                        </table>
                                    </div>
                                </div>
                                {proccessTableStatus ?<div className="row" style={{borderTop: '1px solid white', marginBottom: '10px', marginTop: '10px'}}/>: <div/>}
                                <div className="col-3">
                                    {proccessTableStatus ? <button  onClick={() => displayProccesses(false)} type="button" className="btn btn-primary btn-sm" style={{marginLeft: '10px', marginTop: '20px'}}>Close CPU Table</button>
                                    : 
                                    <button  onClick={() => displayProccesses(false)} type="submit" value="Submit" className="btn btn-primary" hidden/>}
                                </div>
                                {proccessTableStatus ? <div>{proccessTable} </div>: <div hidden>{proccessTable}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            }
            else{
                return <div key={props.value} className="col-12">
                    <div className="card text-white bg-dark">
                        <div className="card-body">
                            <h4 class="card-title">CPU Statistics</h4>
                            <div className="row">
                                <div className="col-8">
                                    <div className="row" style={{height: "200px"}}>
                                        <div className="card text-white bg-dark">
                                            <div className="card-body" style={{display: "flex", justifyContent: "center", marginTop: '40px'}}>
                                                <div className="spinner"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-3">
                                        <div class="table-responsive" style={{marginTop: '30px', marginLeft: '40px'}}>
                                            <table className="table table-borderless row-text" style={{width: '100%'}}>
                                                <thead class="thead-light">
                                                    <tr>
                                                    <th style={{textAlign: 'center' }} scope="col">5 Sec</th>
                                                    <th style={{textAlign: 'center'}} scope="col">One Min</th>
                                                    <th style={{textAlign: 'center'}} scope="col">Five Min</th>
                                                    <th style={{textAlign: 'center'}} scope="col">Procc(s)</th>
                                                    <th style={{textAlign: 'center'}} scope="col">Mem Usg.</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td style={{textAlign: 'center', fontSize: 40}}>0</td>
                                                    <td style={{textAlign: 'center', fontSize: 40}}>0</td>
                                                    <td style={{textAlign: 'center', fontSize: 40}}>0</td>
                                                    <td style={{textAlign: 'center', fontSize: 40}}>0</td>
                                                    <td style={{textAlign: 'center', fontSize: 40}}>0<span style={{textAlign: 'center', fontSize: 10}}>(unknown)</span></td>
                                                </tr></tbody> 
                                            </table>
                                        </div>
                                    {proccessTableStatus ? <div className="row-text">{proccessTable} </div>: <div hidden>{proccessTable}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            } 
        }
        
  