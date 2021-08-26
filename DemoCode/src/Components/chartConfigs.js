import {Chart, LineController, CategoryScale, LineElement, PointElement, LinearScale, Title, Legend, BarController, BarElement } from "chart.js";
import { Link } from "react-router-dom";
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
const $ = require('jquery');
$.DataTable = require('datatables.net');

export function BarCharts(){
        const config = {plugins: {
                            legend: {
                                display: false
                                    },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero:true
                                    }
                                }]
                            }
                        }
                    }
}
          
        
    


export function CpuChartConfig() {

    const config = {
        responsive: true,
        animation: true,
        plugins: {
        legend: {
        display: true,
        labels: {color:'white'},
        position: 'top'
              },
            },
        scales: {
            y: {
            min: 0,
            display: true,
            position: 'right',
            grid: {
                    },
                ticks: {
                    stepSize: 1,
                    color: "yellow"
                }
            },
             x: {
             grid: {
                    borderColor: 'white',
             },
                ticks: {
                    stepSize: 1,
                    color: "white",
                 },
                title: {
                    display: true,
                    text: 'Seconds',
                    color: "white"
    
                }
            }
        }
    };

    return config
}

export function ChartConfig() {

    const config = {
        responsive: true,
        animation: true,
        plugins: {
        legend: {
        display: true,
        labels: {color:'white'},
        position: 'top'
              },
            },
        scales: {
            y: {
            min: 0,
            display: true,
            position: 'right',
            grid: {
                    },
                ticks: {
                    stepSize: 1,
                    color: "yellow"
                }
            },
            y1: {
                min: 0,
                display: true,
                position: 'left',
                grid: {
                        },
                    ticks: {
                        stepSize: 1,
                        color: "white"
                    }
                },
             x: {
             grid: {
                    borderColor: 'white',
             },
                ticks: {
                    stepSize: 1,
                    color: "white",
                 },
                title: {
                    display: true,
                    text: 'Seconds',
                    color: "white"
    
                }
            }
        }
    };

    return config
}

export function BarChart(ctx, data){
    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Legend, BarController, BarElement);
    var chart = new Chart(ctx, {
    type: 'bar',
    options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
            },
        ticks: {
            color: "white"
            },
          },
          x: {
            grid: {
                   borderColor: 'white',
            },
               ticks: {
                   stepSize: 1,
                   color: "white",
                },
               title: {
                   display: false,
                   text: 'Mbps',
                   color: "white"
   
               }
           }
        }
      },
    data: {
        labels: ['Mbps'],
        datasets: [{
            label: ['Mbps'],
            data: [data],
            backgroundColor: [
                'rgba(144, 198, 149, 1)',

            ],
            borderColor: [
                'rgba(30, 130, 76, 1)',
            ],
            borderWidth: 1,
            barThickness: 80
        }]
    },
    })

return chart

}


export function BarChartUpdate(chart, data){

    chart.data.labels.pop();
    chart.data.labels.push('Rate');
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
        dataset.data.push(data);
    })
    
    return chart
}


export function InitialChartBuild(ctx, response, responseTwo){

    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Legend);
    let time = new Date()

    let chart = new Chart(ctx, {
    type: 'line',
    options: ChartConfig(),
    data: {
    labels: [time.getSeconds()],
    datasets: [{
        label: 'Mbps Out',
        borderColor: 'yellow',
        backgroundColor: 'yellow',
        data: [parseInt(response) / 1000],
        fill: false,
        tension: .5,
        yAxisID: 'y'},
        
        {
        label: 'Mbps In',
        borderColor: 'white',
        backgroundColor: 'white',
        data: [parseInt(responseTwo) / 1000],
        fill: false,
        tension: .5,
        yAxisID: 'y1'}],
        }
        });    
    return chart
}

export function InitialCpuChartBuild(ctx, response){

    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Legend);
    let time = new Date()

    let chart = new Chart(ctx, {
    type: 'line',
    options: CpuChartConfig(),
    data: {
    labels: [time.getSeconds()],
    datasets: [{
        label: '5Sec',
        borderColor: 'yellow',
        backgroundColor: 'yellow',
        data: [response],
        fill: true,
        tension: .5,}],
        }
        });    

    return chart
}


export function UpdateChart(chart, response, responseTwo) {

    let time = new Date()
    chart.data.datasets.forEach((dataset, index) => {
    if (dataset.data.length >= 10){
        if(index === 0){
            chart.data.labels.shift();
            chart.data.labels.push(time.getSeconds());
            dataset.data.shift();
            dataset.data.push(parseInt(response));
        }
        else{
            dataset.data.shift();
            dataset.data.push(parseInt(responseTwo));
        }
    }
    else{
        if(index === 0){
            chart.data.labels.push(time.getSeconds());
            dataset.data.push(parseInt(response));
        }
        else{
            dataset.data.push(parseInt(responseTwo));

            }
        }
    });
    return chart
    
}

export function UpdateCpuChart(chart, response) {

    let time = new Date()
    chart.data.datasets.forEach((dataset) => {
    if (dataset.data.length >= 10){
        chart.data.labels.shift();
        chart.data.labels.push(time.getSeconds());
        dataset.data.shift();
        dataset.data.push(response);
    }
    else{
        chart.data.labels.push(time.getSeconds());
        dataset.data.push(response);
        }
    });

    return chart
    
}

export function ArpTableHtml(tableRef) {

    return  <div>
                <div className="col-12">
                    <div class="table-responsive" style={{height: '550px'}}>
                            <table ref={tableRef} className="table  table-dark row-text" style={{width: '100%'}}>
                                <thead class="thead-light">
                                    <tr>
                                        <th >Address</th>
                                        <th >Type</th>
                                        <th >MAC</th>
                                        <th >Type</th>
                                        <th >Time</th>
                                        <th >Vrf</th>    
                                    </tr>
                                </thead>                               
                            </table>
                        </div>
                    </div>
                </div>
    }

export function EnvTableHtml(tableRef) {

    return  <div>
                <div className="col-12">
                    <div class="table-responsive">
                            <table ref={tableRef} className="table table-dark row-text" style={{width: '100%'}}>
                                <thead class="thead-light">
                                    <tr>
                                        <th >Name</th>
                                        <th >Location</th>
                                        <th >State</th>
                                        <th >Current</th>
                                        <th >Meas.</th>
                                    </tr>
                                </thead>                               
                            </table>
                        </div>
                    </div>
                </div>
    }


export function CpuTableHtml(tableRef) {

    return <div class="table-responsive">
                        <table ref={tableRef} className="table table-dark row-text" style={{width: '100%'}}>
                            <thead class="thead-light">
                                <tr>
                                    <th >Name</th>
                                    <th >Five-seconds</th>
                                    <th >One-minute</th>
                                    <th >Five-minutes</th>        
                                </tr>
                            </thead>                               
                        </table>
                    </div>
    }

export function MemTableHtml(tableRef) {

    return  <div class="table-responsive">
                        <table ref={tableRef} className="table table-dark row-text" style={{width: '100%'}}>
                            <thead class="thead-light">
                                <tr style={{textAlign: 'center'}}>
                                    <th >Total</th>
                                    <th >Used</th>
                                    <th >Used%</th>
                                    <th >Free</th>
                                    <th >Free%</th>
                                    <th >Used Avl.</th>
                                    <th >Used Avl%</th>
                                </tr>
                            </thead>                               
                        </table>
                    </div>
    }

    
export function CdpTableHtml(tableRef) {

    return  <div className="col-12">
                <div class="table-responsive ">
                        <table ref={tableRef} className="table table-dark row-text" style={{width: '100%'}}>
                            <thead>
                                <tr>
                                    <th >Device</th>
                                    <th >Platform</th>
                                    <th >Remote-Port</th>
                                    <th >Duplex</th>
                                    <th >Capability Avl.</th>
                                    <th >Mgmt IP</th>
                                    <th >IP</th>
                                    <th >Local Int.</th>
                                </tr>
                            </thead>                               
                        </table>
                    </div>
                </div>
                
    }

export function LldpTableHtml(tableRef) {

    return  <div className="col-12">
                <div class="table-responsive">
                        <table ref={tableRef} className="table table-dark row-text" style={{width: '100%'}}>
                            <thead>
                                <tr>
                                    <th className="text-left">Device</th>
                                    <th >Local Int.</th>
                                    <th >TTL</th>
                                    <th >Remote Int.</th>                             
                                </tr>
                            </thead>                               
                        </table>
                    </div>
                </div>
                
    }

export function VlanTableHtml(tableRef) {

    return  <div className="col-12">
                <div class="table-responsive">
                        <table ref={tableRef} className="table table-dark row-text" style={{width: '100%'}}>
                            <thead>
                                <tr style={{textAlign: 'center'}}>
                                    <th >Name</th>
                                    <th >ID Int.</th>
                                    <th >Status</th>
                                    <th >Interfaces</th>                             
                                </tr>
                            </thead>                               
                        </table>
                    </div>
                </div>
                
    }

export function TrunkTableHtml(tableRef) {
    return  <div className="col-12">
                <div class="table-responsive">
                        <table ref={tableRef} className="table table-dark" style={{width: '100%'}}>
                            <thead>
                                <tr style={{textAlign: 'center'}}>
                                    <th >Interface</th>
                                    <th >vlans</th>
                                    <th >Status</th>
                                    <th >MbpsOut</th>
                                    <th >MbpsIn</th>                            
                                </tr>
                            </thead>                               
                        </table>
                    </div>
                </div>
                
    }
 
export function AccessTableHtml(tableRef) {
    return  <div class="table-responsive">
                <table ref={tableRef} className="table table-dark row-text" style={{width: '100%'}}>
                    <thead>
                        <tr style={{textAlign: 'center'}}>
                            <th >Interface</th>
                            <th >vlan</th>
                            <th >Status</th>
                            <th >MbpsOut</th>
                            <th >MbpsIn</th>                           
                        </tr>
                    </thead>                               
                </table>
            </div>
                
    }
 
export function InterfacesTableHtml(tableRef) {
        return  <div class="table-responsive">
                    <table ref={tableRef} className="table table-dark" style={{width: '100%'}}>
                        <thead>
                            <tr>
                                <th >Interface</th>
                                <th >Status</th>
                                <th >Description</th>
                                <th >IP</th>
                                <th >Mask</th>
                                <th >Speed (Mbps)</th>
				<th >Allocation</th>
                                <th >Trans Band</th> 
                                <th >RecieveBand</th>
				<th >Direction</th>
				<th >Policy</th>             
                            </tr>
                        </thead>                               
                    </table>
                </div>
                    
        }
    
