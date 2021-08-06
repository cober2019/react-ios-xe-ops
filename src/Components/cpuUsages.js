import React, { useState, useEffect } from 'react';
import { UpdateCpuChart, InitialCpuChartBuild, CpuTableHtml, MemTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export function CpuUsage(props){
    const [chart, setChart] = useState(undefined)
    const [cpuStats, setcpuStats] = useState(undefined)
    const [proccessTableStatus, setproccessTableStatus] = useState(false)
    const [memTableStatus, setmemTableStatus] = useState(false)
    const [proccessRef, setcapabilitiesRef] = useState(React.createRef())
    const [chartStatus, setChartStatus] = useState(false)
    const cpuTableRef = React.createRef()
    const memTableRef = React.createRef()
    const proccessTable = CpuTableHtml(proccessRef);
    const memTable = MemTableHtml(memTableRef); 

    useEffect(() => {
        if(chart){
            let updatedChart = UpdateCpuChart(chart, props.cpuMem.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']);
            setChart(updatedChart)
            updatedChart.update()
        }
        
      }, [props.cpuMem])
      
    
    useEffect(() => {
        console.log(props)
    if(chartStatus !== true){
        setChart(InitialCpuChartBuild(cpuTableRef.current.getContext('2d'), props.cpuMem.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']))
        setChartStatus(true)
        }
    }, [])

    const displayProccesses = (bool) =>{
        console.log(props.cpuMem.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['cpu-usage-processes']['cpu-usage-process'])
        if(bool){
            if(proccessTableStatus === false){
                $(proccessRef.current).DataTable({
                    dom: "<\"top\"B><'col-sm-12'f>rt<\"bottom\"p><'col-sm-2'l>",
                    data: props.cpuMem.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['cpu-usage-processes']['cpu-usage-process'],
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

    const displayMemory = (bool) =>{
        if(bool){
            if(memTableStatus === false){
                $(memTableRef.current).DataTable({
                    dom: "",
                    data: [props.cpuMem.mem[0]['memory-stats']],
                    columns:  [
                        { data: 'total'},
                        { data: 'used-number' },
                        { data: 'used-percent' },
                        { data: 'free-number' },
                        { data: 'free-percent' },
                        { data: 'available-number' },
                        { data: 'available-percent'},
                        { data: 'committed-number' },
                        { data: 'committed-percent'}
                    ],});
                    setmemTableStatus(true)
                }
            }
        else{
            $(memTableRef.current).DataTable().destroy()
            setmemTableStatus(false)
        }
    }

    if(setChart !== false){
        return <div key={props.value} className="col-12">
                    <div className="card text-white bg-dark">
                        <div className="card-body">
                            <h4 class="card-title">CPU/Memory Statistics</h4>
                            <div className="row" style={{marginTop: '20px'}}>
                                <div className="col-8">
                                    <div className="row" style={{height: "200px"}}>
                                        <canvas ref={cpuTableRef} style={{height: "100%", marginLeft: '10px'}}/>
                                    </div>
                                </div>
                                <div className="col-1" style={{width: '60px'}}/>
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
                                                <td style={{textAlign: 'center', fontSize: 40}}>{props.cpuMem.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']}</td>
                                                <td style={{textAlign: 'center', fontSize: 40}}>{props.cpuMem.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['one-minute']}</td>
                                                <td style={{textAlign: 'center', fontSize: 40}}>{props.cpuMem.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-minutes']}</td>
                                                <td href="#" style={{textAlign: 'center', fontSize: 40}}><a onClick={() => displayProccesses(true)} href="#">{props.cpuMem.data['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['cpu-usage-processes']['cpu-usage-process'].length}</a></td>
                                                <td style={{textAlign: 'center', fontSize: 40}}><a onClick={() => displayMemory(true)} href="#">{props.cpuMem.mem[0]['memory-stats']['available-percent']}</a><span style={{textAlign: 'center', fontSize: 10}}>({props.cpuMem.mem[0]['memory-stats']['memory-status']})</span></td>
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

                                {memTableStatus ?<div className="row" style={{borderTop: '1px solid white', marginBottom: '10px', marginTop: '10px'}}/>: <div/>}
                                <div className="col-3">
                                    {memTableStatus ? <button  onClick={() => displayMemory(false)} type="button" className="btn btn-primary btn-sm" style={{marginLeft: '10px', marginTop: '20px'}}>Close Mem Table</button>
                                    : 
                                    <button  onClick={() => displayMemory(false)} type="submit" value="Submit" className="btn btn-primary" hidden/>}
                                </div>
                                {memTableStatus ? <div>{memTable} </div>: <div hidden>{memTable}</div>}
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
                                            <canvas ref={cpuTableRef} style={{height: "100%", marginLeft: '10px'}} hidden/>
                                        </div>
                                    </div>
                                    <div className="row" style={{height: "200px"}}>
                                        <div className="card text-white bg-dark">
                                            <div className="card-body" style={{display: "flex", justifyContent: "center", marginTop: '40px'}}>
                                                <div className="spinner"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-1" style={{width: '60px'}}/>
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
                                    </div>
                                </div>
                            </div>
                        </div>
            } 
        }
        
  