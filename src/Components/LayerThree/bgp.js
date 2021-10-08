import React, { useEffect, useRef } from 'react';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CreateCard } from '../Other/jsxCard';
import { BgpTableHtml } from '../Other/chartConfigs';
import { BgpData } from '../Other/tables';
import { BgpTopologyBuild, UpdateBgpTopology } from './topology';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Bgp(props){
  const bgpTableRef = React.createRef()
  const bgpTopologyRef = React.createRef()
  const bgpTopology = useRef(null)
  const bgpTable = BgpTableHtml(bgpTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(bgpTableRef.current !== null){
      try{
        $(bgpTableRef.current).DataTable().clear()
        $(bgpTableRef.current).DataTable().rows.add(props.neighbors)
        $(bgpTableRef.current).DataTable().draw(false)
      }
      catch{}
      try{
        bgpTopology.current = UpdateBgpTopology(bgpTopology.current, props.neighbors, props.details[2])
        bgpTopologyRef.current =  bgpTopology.current
      }
      catch{}
      }
    }, [props.neighbors])

  useEffect(() => {
  
    $(bgpTableRef.current).DataTable().destroy()
    BgpData(bgpTableRef.current, props.neighbors)

    try{
      if(props.neighbors.length >= 1){
        bgpTopology.current = BgpTopologyBuild(bgpTopologyRef.current, props.neighbors, props.details[0], props.details[2], props.details[5], props.topology)
        bgpTopologyRef.current =  bgpTopology.current
      }
    }
    catch{}

  }, [])

  if(props.neighbors.length !== 0){
    return   <Row>
              <Col lg={4}>
                <Card bg={"dark"}>
                  <Card.Body>
                    <Card.Title className="mb-3">Local AS: {props.details[0]}</Card.Title>
                      <Row>
                          <Col lg={6}>
                              <p className="card-text">Vrf-Name:</p>
                              <p className="card-text">Router-Id:</p>
                              <p className="card-text">BGP Table Ver.:</p>
                              <p className="card-text">Routing Table Ver.:</p>
                              <p className="card-text">Total Prefixes:</p>
                              <p className="card-text">Path Entries:</p>
                              <p className="card-text">AS Path Ent.</p>
                              <p className="card-text">Route-Map Ent.</p>
                              <p className="card-text">Filter-List Ent.:</p>
                              <p className="card-text">Total Memory:</p>
                          </Col>
                          <Col xl={6}>
                              <p className="card-text">{props.details[1]}</p>
                              <p className="card-text">{props.details[2]}</p>
                              <p className="card-text">{props.details[3]}</p>
                              <p className="card-text">{props.details[4]}</p>
                              <p className="card-text">{props.details[5]}</p>
                              <p className="card-text">{props.details[7]}</p>
                              <p className="card-text">{props.details[9]}</p>
                              <p className="card-text">{props.details[11]}</p>
                              <p className="card-text">{props.details[13]}</p>
                              <p className="card-text">{props.details[19]}</p>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                    </Col>
                    <Col lg={8}>
                        <Row >
                          {CreateCard(bgpTable, "BGP Neighbors")}
                        </Row>
                        <Row>
                            <div ref={bgpTopologyRef} className="bg-dark" style={{width: '1500px', height: '300px'}}/>
                        </Row>
                      </Col>
                    </Row>
                        

  }
  else{
    return  <div className="card text-white bg-dark ">
            <div className="card-body">
            <h4 class="card-title mb-3">BGP Neighbors</h4>
                {bgpTable}
            </div>
        </div>
  }
            
  }
  
