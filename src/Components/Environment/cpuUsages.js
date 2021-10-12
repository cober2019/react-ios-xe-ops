import React, { useEffect, useRef} from 'react';
import ReactSpeedometer from "react-d3-speedometer"
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { UpdateCpuChart, CpuTableHtml, MemTableHtml, InitialCpuChartBuild } from '../Other/chartConfigs';
import { CpuProcessData, MemoryData } from '../Other/tables';
import { CreateCard } from '../Other/jsxCard';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export function CpuUsage(props){
    const cpuChart = useRef(null)
    const cpuMemCss = useRef(null)
    const cpuTableRef = React.createRef()
    const proccessRef = React.createRef()
    const memRef = React.createRef()
    const memTable = MemTableHtml(memRef);
    const proccessTable = CpuTableHtml(proccessRef);
    $.fn.dataTable.ext.errMode = 'none';

    if(parseInt(props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']) > 25 || props.mem['memory-status'] !== 'Healthy'){
         cpuMemCss.current = {color: 'orange', textAlign: 'center', fontSize: 40}
    }
    else{
         cpuMemCss.current = {color: 'greenyellow', textAlign: 'center', fontSize: 40}
    }

    useEffect(() => {

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

        $(proccessRef.current).DataTable().destroy()
        CpuProcessData(proccessRef.current, props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['cpu-usage-processes']['cpu-usage-process'])

        $(memRef.current).DataTable().destroy()
        MemoryData(memRef.current, props.mem)
        
    }, [])

    if (props.from !== 'navbar'){
        return <div><Card bg={"dark"}  className="mb-3">
                   <Card.Body >
                        <Card.Title className="mb-3">CPU/Memory</Card.Title>
                        <Row >
                        <Col xl={3}>
                            <h5 className="text-center">Five Sec</h5>
                                            <ReactSpeedometer
                                                                            maxValue={100}
                                                                            value={props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']}
                                                                            needleColor="red"
                                                                            startColor="green"
                                                                            segments={10}
                                                                            width={200}
                                                                            height={150}
                                                                            ringWidth={30}
                                                                            textColor="white"
                                                                            endColor="red"
                                                                            />
                                                                             </Col>
                                            <Col xl={3}>
                                            <h5 className="text.center">One Min</h5>
                                            <ReactSpeedometer
                                                                            maxValue={100}
                                                                            value={props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['one-minute']}
                                                                            needleColor="red"
                                                                            startColor="green"
                                                                            segments={10}
                                                                            width={200}
                                                                            height={150}
                                                                            ringWidth={30}
                                                                            textColor="white"
                                                                            endColor="red"
                                                                            />
                                                                            </Col>
                                            <Col xl={3}>
                                            <h5 className="text.center">Five Min</h5>
                                            <ReactSpeedometer
                                                                            maxValue={100}
                                                                            value={props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-minutes']}
                                                                            needleColor="red"
                                                                            startColor="green"
                                                                            segments={10}
                                                                            width={200}
                                                                            height={150}
                                                                            ringWidth={30}
                                                                            textColor="white"
                                                                            endColor="red"
                                                                            /> 
                                                                            </Col>
                                            <Col xl={3}>
                                            <h5 className="text.center">Memory</h5>
                                            <ReactSpeedometer
                                                                            maxValue={100}
                                                                            value={props.mem['used-percent']}
                                                                            needleColor="red"
                                                                            startColor="green"
                                                                            segments={10}
                                                                            width={200}
                                                                            height={150}
                                                                            ringWidth={30}
                                                                            textColor="white"
                                                                            endColor="red"
                                                                            />
                                                                            </Col>
                                                                            </Row>

                    </Card.Body>
            </Card>
            {CreateCard(memTable, "Memory Statistics")}
            {CreateCard(proccessTable, "CPU Processes")}
            </div>
        }
        else{
            <p>{props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']}<span><p style={cpuMemCss}>{props.mem['used-percent']}</p></span></p>

        }
    }

        
        
        
  