import React, { useState, useEffect } from 'react';
import { UpdateCpuChart, InitialCpuChartBuild, CpuTableHtml, MemTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export function CpuUsage(props){
    const [chart, setChart] = useState(false)
    const [error, setError] = useState(false)
    const cpuTableRef = React.createRef()
    const proccessRef = React.createRef()
    const proccessTable = CpuTableHtml(proccessRef);
    $.fn.dataTable.ext.errMode = 'none';

    if(parseInt(props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']) > 1 || props.mem[0]['memory-stats']['memory-status'] !== 'Healthy'){
        var cpuMemCss = {color: 'orange', textAlign: 'center', fontSize: 40}
    }
    else{
        var cpuMemCss = {color: 'greenyellow', textAlign: 'center', fontSize: 40}
    }

    useEffect(() => {
        if(chart){
            let updatedChart = UpdateCpuChart(chart, props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']);
	    updatedChart.update()
            setChart(updatedChart)
            
        }
        try{
            $(proccessRef.current).DataTable().clear()
            $(proccessRef.current).DataTable().rows.add(props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['cpu-usage-processes']['cpu-usage-process'])
            $(proccessRef.current).DataTable().draw(false)
          }
          catch(e){
            console.log(e)
          }
      }, [props.mem, props.cpu])
      
    
    useEffect(() => {
        
        try{
            var chart = InitialCpuChartBuild(cpuTableRef.current.getContext('2d'), props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds'])
        }
        catch{}

        $(proccessRef.current).DataTable().destroy()
        $(proccessRef.current).DataTable({
            data: props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['cpu-usage-processes']['cpu-usage-process'],
            language: {
                emptyTable: "No CPU Processes Found"
              },
            columns:  [
                { data: 'name' },
                { data: 'total-run-time' },
                { data: 'avg-run-time' },
                { data: 'five-seconds' },
                { data: 'one-minute' },
                { data: 'five-minutes' }
            ],
            
            fnRowCallback: function (nRow, aData) {
                try{
                    if(parseFloat(aData['five-seconds']) > 25 ){
                        $('td:eq(3)', nRow).addClass('env-row-text-warn')
                        }
                    if(parseFloat(aData['one-minute']) > 25 ){
                        $('td:eq(4)', nRow).addClass('env-row-text-warn')
                        }
                    if(parseFloat(aData['five-minutes']) > 25 ){
                        $('td:eq(5)', nRow).addClass('env-row-text-warn')
                        }
                    }
                catch{}
            }})

        setChart(chart)

    }, [])

    return <div className="col-12">
            <div className="card text-white bg-dark">
                <div className="card-body">
                    <h4 class="card-title mb-3">CPU/Memory Statistics</h4>
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
                                        <td style={cpuMemCss}>{props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']}</td>
                                        <td style={cpuMemCss}>{props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['one-minute']}</td>
                                        <td style={cpuMemCss}>{props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-minutes']}</td>
                                        <td href="#" style={cpuMemCss}>{props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['cpu-usage-processes']['cpu-usage-process'].length}</td>
                                        <td style={cpuMemCss}>{props.mem[0]['memory-stats']['available-percent']}</td>
                                    </tr>
                                    </tbody>                             
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card bg-dark mt-3">
                <div className="card-body">
                    <div className="row">
                        <div className="col-12">
                            {proccessTable}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

        
        
        
  