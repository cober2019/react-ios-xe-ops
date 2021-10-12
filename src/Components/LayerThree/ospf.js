import React, { useEffect, useRef } from 'react';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { OpsfIntsTableHtml } from '../Other/chartConfigs';
import { OspfData} from '../Other/tables';
import { OspfTopologyBuild, UpdateOspfTopology } from './topology';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Ospf(props){
  const ospfTableRef = React.createRef()
  const ospfIntsTableRef = React.createRef()
  const ospfTopologyRef = React.createRef()
  const ospfTopology = useRef(null)
  const ospfIntTable = OpsfIntsTableHtml(ospfIntsTableRef)
  $.fn.dataTable.ext.errMode = 'none';
  console.log(props.interfaces)

  useEffect(() => {
    if(ospfTableRef.current !== null){
    
      try{
        $(ospfIntsTableRef.current).DataTable().clear()
        $(ospfIntsTableRef.current).DataTable().rows.add(Object.values(props.interfaces))
        $(ospfIntsTableRef.current).DataTable().draw(false)
      }
      catch{}

      try{
        ospfTopology.current = UpdateOspfTopology(ospfTopology.current, props.neighbors, props.topology)
        ospfTopologyRef.current =  ospfTopology.current
      }
      catch(e){}
    }
    }, [props.neighbors])

  useEffect(() => {

        $(ospfIntsTableRef.current).DataTable().destroy()
        OspfData(ospfIntsTableRef.current, props.interfaces)
         
        try{
          if(props.interfaces.length >= 1){
            ospfTopology.current = OspfTopologyBuild(ospfTopologyRef.current, props.neighbors, props.topology)
            ospfTopologyRef.current =  ospfTopology.current
          }
        }
        catch{}

      }, [])
  
    return <Card bg={"dark"}>
                <Card.Body>
                  <Card.Title className="mb-3">OSPF Interfaces/Neighbors</Card.Title>
                  {ospfIntTable}
                </Card.Body>
                <Row>
                  <Col>
                    {props.topology.length > 0 ? <div ref={ospfTopologyRef} className="bg-dark  mt-3" style={{width: '100%', height: '300px'}}/> : <div/>}
                    </Col>
                </Row>
              </Card>
  }
  