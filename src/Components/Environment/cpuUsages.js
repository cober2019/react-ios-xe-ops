import React, { useEffect, useRef} from 'react';

import { UpdateCpuChart, CpuTableHtml, MemTableHtml, InitialCpuChartBuild } from '../Other/chartConfigs';
import { CpuProcessData, MemoryData } from '../Other/tables';
import { CreateCard } from '../Other/jsxCard';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export function CpuUsage(props){
    const cpuChart = useRef(null)
    const cpuTableRef = React.createRef()
    const proccessRef = React.createRef()
    const memRef = React.createRef()
    const memTable = MemTableHtml(memRef);
    const proccessTable = CpuTableHtml(proccessRef);
    $.fn.dataTable.ext.errMode = 'none';

    if(parseInt(props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']) > 25 || props.mem['memory-status'] !== 'Healthy'){
        var cpuMemCss = {color: 'orange', textAlign: 'center', fontSize: 40}
    }
    else{
        var cpuMemCss = {color: 'greenyellow', textAlign: 'center', fontSize: 40}
    }

    useEffect(() => {

        if(cpuChart.current !== null){
            try{
                let updatedChart = UpdateCpuChart(cpuChart.current, props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']);
                cpuChart.current = updatedChart
                updatedChart.update()
            }
            catch{}
        }

        try{
            $(proccessRef.current).DataTable().clear()
            $(proccessRef.current).DataTable().rows.add(props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['cpu-usage-processes']['cpu-usage-process'])
            $(proccessRef.current).DataTable().draw(false)
            $(memRef.current).DataTable().clear()
            $(memRef.current).DataTable().rows.add(props.mem)
          }
          catch{}

      }, [props.cpu, props.mem])
      
    
    useEffect(() => {
        console.log('yes')
        let chart = InitialCpuChartBuild(cpuTableRef.current.getContext('2d'), props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds'])
        cpuChart.current = chart

        $(proccessRef.current).DataTable().destroy()
        CpuProcessData(proccessRef.current, props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['cpu-usage-processes']['cpu-usage-process'])

        $(memRef.current).DataTable().destroy()
        MemoryData(memRef.current, props.mem)
        
    }, [])

    if (props.from !== 'navbar'){
        return <div className="col-12">
                <div className="card text-white bg-dark">
                    <div className="card-body mb-3">
                        <h5 class="card-title mb-3">CPU/Memory Summary</h5>
                        <div className="row" style={{marginTop: '20px'}}>
                            <div className="col-7">
                                <div className="row" style={{height: "225px"}}>
                                    <canvas ref={cpuTableRef} style={{height: "100%", marginLeft: '10px'}}/>
                                </div>
                            </div>
                            <div className="col-1" style={{width: '60px'}}/>
                            <div className="col-4">
                                <div class="table-responsive" style={{marginTop: '20px'}}>
                                    <table className="table table-borderless row-text">
                                        <thead class="thead-light">
                                            <tr style={{color: "white"}}>
                                                <th style={{textAlign: 'center' }} scope="col">5 Sec</th>
                                                <th style={{textAlign: 'center'}} scope="col">One Min</th>
                                                <th style={{textAlign: 'center'}} scope="col">Five Min</th>
                                                <th style={{textAlign: 'center'}} scope="col">Processes</th>
                                                <th style={{textAlign: 'center'}} scope="col">Mem Usg.</th>
                                            </tr>
                                        </thead>  
                                        <tbody>
                                        <tr className="fade-in">
                                            <td style={cpuMemCss}>{props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']}</td>
                                            <td style={cpuMemCss}>{props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['one-minute']}</td>
                                            <td style={cpuMemCss}>{props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-minutes']}</td>
                                            <td href="#" style={cpuMemCss}>{props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['cpu-usage-processes']['cpu-usage-process'].length}</td>
                                            <td style={cpuMemCss}>{props.mem['used-percent']}</td>
                                        </tr>
                                        </tbody>                             
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {CreateCard(memTable, "Memory Statistics")}
                {CreateCard(proccessTable, "CPU Processes")}
            </div>
        }
        else{
            <p>{props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']}<span><p style={cpuMemCss}>{props.mem['used-percent']}</p></span></p>

        }
    }

        
        
        
  