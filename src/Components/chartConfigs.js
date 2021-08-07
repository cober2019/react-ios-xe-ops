import {Chart, LineController, CategoryScale, LineElement, PointElement, LinearScale, Title, Legend } from "chart.js";
const $ = require('jquery');
$.DataTable = require('datatables.net');

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
            dataset.data.push(parseInt(response) / 1000);
        }
        else{
            dataset.data.shift();
            dataset.data.push(parseInt(responseTwo) / 1000);
        }
    }
    else{
        if(index === 0){
            chart.data.labels.push(time.getSeconds());
            dataset.data.push(parseInt(response) / 1000);
        }
        else{
            dataset.data.push(parseInt(responseTwo) / 1000);

            }
        }
    });
    return chart
    
}

export function UpdateCpuChart(chart, response) {

    console.log(chart.data, response)

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

export function TableHtml(tableRef) {

    return  <div>
                <div className="col-12">
                    <div class="table-responsive" style={{height: '550px'}}>
                            <table ref={tableRef} className="table row-text" style={{width: '100%'}}>
                                <thead class="thead-light">
                                    <tr>
                                        <th scope="col">Address</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">MAC</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Time</th>    
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
                            <table ref={tableRef} className="table row-text" style={{width: '100%'}}>
                                <thead class="thead-light">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Location</th>
                                        <th scope="col">State</th>
                                        <th scope="col">Current</th>
                                        <th scope="col">Meas.</th>
                                    </tr>
                                </thead>                               
                            </table>
                        </div>
                    </div>
                </div>
    }


export function CpuTableHtml(tableRef) {

    return  <div>
                <div className="col-12">
                    <div class="table-responsive" style={{height: '550px'}}>
                            <table ref={tableRef} className="table" style={{width: '100%'}}>
                                <thead class="thead-light">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">TTY</th>
                                        <th scope="col">Run Time</th>
                                        <th scope="col">Invocation-count</th>
                                        <th scope="col">Avg-run-time</th>
                                        <th scope="col">Five-seconds</th>
                                        <th scope="col">One-minute</th>
                                        <th scope="col">Five-minutes</th>        
                                    </tr>
                                </thead>                               
                            </table>
                        </div>
                    </div>
                </div>
    }

export function MemTableHtml(tableRef) {

    return  <div>
                <div className="col-12">
                    <div class="table-responsive">
                            <table ref={tableRef} className="table row-text" style={{width: '100%'}}>
                                <thead class="thead-light">
                                    <tr style={{textAlign: 'center'}}>
                                        <th scope="col">Total</th>
                                        <th scope="col">Used</th>
                                        <th scope="col">Used%</th>
                                        <th scope="col">Free</th>
                                        <th scope="col">Free%</th>
                                        <th scope="col">Used Avl.</th>
                                        <th scope="col">Used Avl%</th>
                                        <th scope="col">Committed</th>
                                        <th scope="col">Committed%</th>
    
                                    </tr>
                                </thead>                               
                            </table>
                        </div>
                    </div>
                </div>
    }

