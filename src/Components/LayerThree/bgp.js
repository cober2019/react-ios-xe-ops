import React, { useEffect, useRef } from 'react';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CreateCard } from '../Other/jsxCard';
import { BgpTableHtml } from '../Other/chartConfigs';
import { BgpData } from '../Other/tables';
import { BgpTopologyBuild, UpdateBgpTopology } from './topology';
import { ModifyBgpNeighbor } from '../Forms/bgpNeighborForm';
import { BgpModal } from '../Modals/bgpFormModal';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Bgp(props){
  const [modalShow, setModalShow] = React.useState(false);
  const bgpTableRef = React.createRef()
  const bgpTopologyRef = React.createRef()
  const bgpTopology = useRef(null)
  const bgpTable = BgpTableHtml(bgpTableRef)

  useEffect(() => {

    try{
      if(props.neighbors.length <= 10){
        $(bgpTableRef.current).DataTable().destroy()
        BgpData(bgpTableRef.current, props.neighbors)
        bgpTopology.current = BgpTopologyBuild(bgpTopologyRef.current, props.neighbors, props.details[0], props.details[2], props.details[5], props.topology)
        bgpTopologyRef.current =  bgpTopology.current

      }
      else if(props.neighbors.length > 10){
          $(bgpTableRef.current).DataTable().clear()
          $(bgpTableRef.current).DataTable().rows.add(props.neighbors)
          $(bgpTableRef.current).DataTable().draw(false)
          bgpTopology.current = UpdateBgpTopology(bgpTopology.current, props.neighbors, props.details[2])
          bgpTopologyRef.current =  bgpTopology.current
      }

	  }
      catch{}

  }, [props.neighbors])


  if(props.neighbors.length !== 0){
    return   <Row>
              <Col xl={4}>
                <Card bg={"dark"} className="overflow-auto mb-3">
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
                        <Row>
                        {modalShow ? <BgpModal  component={<ModifyBgpNeighbor routeMaps={props.routeMaps} prefixLists={props.prefixLists} localAs={props.details[0]} neighborTable={props.neighbors} routerId={props.details[2]}/>} show={modalShow} onHide={() => setModalShow(false)}/> : <div></div>}
                        </Row>
                        <Row >
                          {CreateCard(bgpTable, "BGP Neighbors",  <div className="mb-3 d-flex justify-content-end"><button type="button" className="btn btn-success btn-md mt-3" onClick={()=> setModalShow(true)}>Add Neighbor</button></div>)}
                        </Row>
                      <Row>
                          {CreateCard(<div ref={bgpTopologyRef} className="bg-dark" style={{width: '1300px', height: '300px'}}/>, "BGP Topology")}
                      </Row>
                    </Col>
                  </Row>

                        

  }
  else{
    return  <Card bg={"dark"} className="overflow-auto">
              <Card.Body>
                <Card.Title className="mb-3">BGP Neighbors</Card.Title>
                <div className="mb-3 d-flex justify-content-end"><button type="button" className="btn btn-success btn-md mt-3" onClick={()=> setModalShow(true)}>Add Neighbor</button></div>
                    {bgpTable}
 			{modalShow ? <BgpModal  component={<ModifyBgpNeighbor routeMaps={props.routeMaps} prefixLists={props.prefixLists} localAs={props.details[0]} neighborTable={props.neighbors} routerId={props.details[2]}/>} show={modalShow} onHide={() => setModalShow(false)}/> : <div></div>}
                </Card.Body>
            </Card>
  }
            
  }
  
