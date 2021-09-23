import {Chart, LineController, CategoryScale, LineElement, PointElement, LinearScale, Title, Legend, BarController, BarElement } from "chart.js";
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

export function BarChart(ctx, inbound, drops){
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
            data: [inbound],
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
                    <div class="table-responsive">
                            <table ref={tableRef} className="table  table-dark row-text" style={{width: '100%'}}>
                                <thead class="thead-light">
                                    <tr>
                                        <th >Address</th>
                                        <th >Encap Type</th>
                                        <th >Mac</th>
                                        <th >Mode</th>
                                        <th >Time</th>
                                        <th >Link Type</th>
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
                                    <th >Run Time</th>
                                    <th >Avg-run-time</th>
                                    <th >Five-seconds</th>
                                    <th >One-minute</th>
                                    <th >Five-minutes</th>        
                                </tr>
                            </thead>                               
                        </table>
                    </div>
    }

export function MacTableHtml(tableRef) {

        return <div class="table-responsive">
                            <table ref={tableRef} className="table table-dark row-text" style={{width: '100%'}}>
                                <thead class="thead-light">
                                    <tr>
                                        <th >Vlan</th>
                                        <th >MAC</th>
                                        <th >Type</th>
                                        <th >Port</th>       
                                    </tr>
                                </thead>                               
                            </table>
                        </div>
        }
    

export function MemTableHtml(tableRef) {

    return  <div class="table-responsive">
                        <table ref={tableRef} className="table table-dark row-text"  style={{width: '100%'}}>
                            <thead class="thead-light">
                                <tr>
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

export function OpsfTableHtml(tableRef) {

        return  <div class="table-responsive">
                    <table ref={tableRef} className="table table-dark row-text"  style={{width: '100%'}}>
                        <thead class="thead-light">
                            <tr>
                                <th >Neighbor ID</th>
                                <th >Address</th>
                                <th >State</th>
                                <th >DR</th>
                                <th >bdr</th>
                            </tr>
                        </thead>                               
                    </table>
                </div>
        }

export function HsrpTableHtml(tableRef) {

            return  <div class="table-responsive">
                        <table ref={tableRef} className="table table-dark row-text"  style={{width: '100%'}}>
                            <thead class="thead-light">
                                <tr>
                                    <th >Vlan</th>
                                    <th >Group</th>
                                    <th >Priority</th>
                                    <th >State</th>
                                    <th >Standby</th>
                                    <th >VIP</th>
                                </tr>
                            </thead>                               
                        </table>
                    </div>
            }

export function DmvpnTableHtml(tableRef) {


    return  <div class="table-responsive">
                <table ref={tableRef} className="table table-dark row-text"  style={{width: '100%'}}>
                    <thead class="thead-light">
                        <tr>
                            <th >Peer NBMA</th>
                            <th >Peer Tunnel</th>                    
                            <th >State</th>
                            <th >Up Time</th>
                            <th >Attribute</th>
                        </tr>
                    </thead>                               
                </table>
            </div>
    }

                
export function OpsfIntsTableHtml(tableRef) {

            return  <div class="table-responsive">
                        <table ref={tableRef} className="table table-dark row-text"  style={{width: '100%'}}>
                            <thead class="thead-light">
                                <tr>
                                    <th >Name</th>
                                    <th >Net Type</th>
                                    <th >Area</th>
                                    <th >BDR</th>
                                    <th >DR</th>
                                    <th >Cost</th>
                                    <th >Dead Int.</th>
                                    <th >Hello In.</th>
                                    <th >Hello Timer</th>
                                    <th >Priority</th>
                                    <th >Neighbor ID</th>
                                    <th >Address</th>
                                    <th >State</th>
                                    <th >DR</th>
                                    <th >bdr</th>
                                </tr>
                            </thead>                               
                        </table>
                    </div>
            }

export function BgpTableHtml(tableRef) {

    return  <div class="table-responsive">
                <table ref={tableRef} className="table table-dark row-text"  style={{width: '100%'}}>
                    <thead class="thead-light">
                        <tr>
                            <th >ID</th>
                            <th >Remote AS</th>
                            <th >Uptime</th>
                            <th >State</th>
                            <th >Prefixes Rec.</th>
                            <th >Prefixes Sent</th>
                            <th >Installed Prefixes</th>
                            <th >Local Port</th>
                            <th >Remote Port</th>
                        </tr>
                    </thead>                               
                </table>
            </div>
    }

export function SpanTreeHtml(tableRef) {

        return  <div class="table-responsive">
                    <table ref={tableRef} className="table table-dark row-text" style={{height: 175, width: '100%'}}>
                        <thead class="thead-light">
                            <tr>
                                <th >Name</th>
                                <th >Cost</th>
                                <th >Port Priority</th>
                                <th >Role</th>
                                <th >State</th>
                                <th >Fwd. Transistion</th>
                                <th >Link Type</th>
                            </tr>
                        </thead>                               
                    </table>
                </div>
        }

export function GlobalSpanTreeHtml(data) {
        console.log(data)
        if(data !== undefined){
            return  <div className="card bg-dark">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-2">
                                <h4 class="card-title mb-3">Mode: {data.mode}</h4>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                {data['bridge-assurance'] ? <p className="card-text">Bridge Assurance:</p> : <div></div>}
                                {data['loop-guard'] ? <p className="card-text">Loop Guard:</p> : <div></div>}
                                {data['bpdu-guard'] ? <p className="card-text">BPDU Guard:</p> : <div></div>}
                                {data['etherchannel-misconfig-guard'] ? <p className="card-text">EtherChannel Mis.</p> : <div></div>}
                            </div>
                            <div className="col-2">
                                <p className="card-text">{data['bridge-assurance'][0] === null ? 'Disabled' : data['bridge-assurance']}</p>
                                <p className="card-text">{data['loop-guard'][0] === null ? 'Disabled' : data['loop-guard']}</p>
                                <p className="card-text">{data['bpdu-guard'] && data['bpdu-guard'][0] === null ? 'Disabled' : data['bpdu-guard']}</p>
                                <p className="card-text">{data['etherchannel-misconfig-guard'][0] === null ? 'Disabled' : data['etherchannel-misconfig-guard']}</p>
                            </div>
                            <div className="col-8"></div>
                        </div>
                        </div>
                    </div>
            }
            else{
                return <h4 style={{textAlign: 'center'}}>Spanning Tree Not Enabled</h4>
            }
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
                                <th >Qos Allocation</th>
                                <th >Trans Band</th> 
                                <th >RecieveBand</th>
                                <th >Qos Policy</th>
                                <th >Policy Direction</th>                          
                            </tr>
                        </thead>                               
                    </table>
                </div>
                    
        }

export function DmvpnHubTableHtml(tableRef) {
            return  <div class="table-responsive">
                        <table ref={tableRef} className="table table-dark" style={{width: '100%'}}>
                            <thead>
                                <tr>
                                    <th >Interface</th>
                                    <th >Status</th>
                                    <th >Priority</th>                                                          
                                </tr>
                            </thead>                               
                        </table>
                    </div>
                        
            }
    

export function TunnelInterfacesTableHtml(tableRef) {
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
                                    <th >Trans Band</th> 
                                    <th >RecieveBand</th>                       
                                </tr>
                            </thead>                               
                        </table>
                    </div>
                        
            }

export function DmvpnHubsTableHtml(tableRef) {
    return  <div class="table-responsive">
                <table ref={tableRef} className="table table-dark" style={{width: '100%'}}>
                    <thead>
                        <tr>
                            <th >NBMA</th>
                            <th >IP</th>            
                        </tr>
                    </thead>                               
                </table>
            </div>
                
    }

export function DmvpnInterfacesTableHtml(tableRef) {
    return  <div class="table-responsive">
                <table ref={tableRef} className="table table-dark" style={{width: '100%'}}>
                    <thead>
                        <tr>
                            <th >Interface</th>
                            <th >Source</th>
                            <th >MTU</th>
                            <th >MSS</th>
                            <th >Mode</th>
                            <th >Authentication</th>
                            <th >HoldTime</th> 
                            <th >Protection</th>
                            <th >Network ID</th>                       
                        </tr>
                    </thead>                               
                </table>
            </div>
                
    }



export function NbmaLocationTableHtml(tableRef) {
    return  <div class="table-responsive">
                <table ref={tableRef} className="table table-dark" style={{width: '100%'}}>
                    <thead>
                        <tr>
                            <th >IP</th>
                            <th >Country Code</th>
                            <th >City</th>
                            <th >Contenent Code</th>
                            <th >Latitude</th>
                            <th >Longitude</th>
                            <th >Organization</th>
                            <th >ASN</th> 
                            <th >TimeZone</th>
                        </tr>
                    </thead>                               
                </table>
            </div>
                
    }

export function Ipv4RibTableHtml(tableRef) {

return <div class="table-responsive">
    <table ref={tableRef} className="table table-dark" style={{width: '100%'}}>
        <thead >
            <tr id='headr'>
                <th >Name</th>
                <th >Address-Family</th>
                <th >Destination</th>
                <th >Prefrence</th>
                <th >Metric</th>
                <th >Nex-Hop</th>
                <th >Out Interface</th>
                <th >Is Active</th>
                <th >Source Protocol</th>
            </tr>
        </thead>
    </table>
</div>
}

export function Ipv6RibTableHtml(tableRef) {

    return <div class="table-responsive">
                <table ref={tableRef} className="table table-dark" style={{width: '100%'}}>
                    <thead>
                        <tr>
                            <th >Name</th>
                            <th >Address-Family</th>
                            <th >Destination</th>
                            <th >Prefrence</th>
                            <th >Metric</th>
                            <th >Nex-Hop</th>
                            <th >Out Interface</th>
                            <th >Is Active</th>
                            <th >Source Protocol</th>
                        </tr>
                    </thead>
                </table>
            </div>
}

export function PlusRibEntriesTableHtml(tableRef) {

    return <div class="table-responsive">
                <table ref={tableRef} className="table table-dark" style={{width: '100%'}}>
                    <thead>
                        <tr>
                            <th >Destination</th>
                            <th >Nex-Hop</th>
                            <th >Out Interface</th>
                            <th >Source Protocol</th>
                            <th >TimeStamp</th>
                        </tr>
                    </thead>
                </table>
            </div>
}


export function ProtocolsTableHtml(tableRef) {

    return  <div class="table-responsive">
                <table ref={tableRef} className="table table-dark" style={{width: '100%'}}>
                    <thead>
                        <tr>
                            <th >Protocol</th>
                            <th >ID</th>
                            <th >Name</th>
                            <th >Type</th>
                            <th >Interfaces</th>
                        </tr>
                    </thead>
                </table>
            </div>
}




        
    
