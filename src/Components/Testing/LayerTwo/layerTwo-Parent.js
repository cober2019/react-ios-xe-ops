import React, { useRef } from 'react';
import axios from 'axios';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { DpNeighbors} from './dp_neighbors'
import { MacTable} from './macAddress'
import { SpanTable} from './spanTree'
import { Trunks} from './trunks'
import { AccessPorts} from './accessPorts'
import { Vlans} from './vlans'
import { ErrorBoundary } from  'react-error-boundary'
import { CreateCard } from '../../Other/jsxCard';
import { Card } from 'react-bootstrap';
import { IsErrorFallback } from "../../Other/errorComponent";

export  function LayerTwo(props){
  const span = props.span
  const dpNeighbors = props.dpNeighbors
  const vlans = props.vlans
  const trunks = props.trunks
  const mac_addresses = props.mac_addresses
  const access = props.access
  const bridgeGlobalTble = props.bridgeGlobalTble

  return <Container fluid>
            
                <div>
                  <Card bg={"dark"}>
                    <Card.Body>
                      <Tabs defaultActiveKey="globalvlan" id="spanningtre" bg={"success"}>
                      <Tab eventKey="globalvlan" title="Global Setting">
                            {bridgeGlobalTble}
                          </Tab>
                        {span.hasOwnProperty.key ? <Tab eventKey="pervlan" title="Spanning Tree">
                          { span.map(instance => (<ErrorBoundary FallbackComponent={IsErrorFallback}><SpanTable span={instance}/></ErrorBoundary>))}
                          </Tab> : <div/>}
                      </Tabs>
                    </Card.Body>
                  </Card>
                      <Row>
                        <Col xl={12}>
                          {CreateCard(<DpNeighbors dpNeighbors={dpNeighbors}/>)}
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={7}>
                            {vlans.length > 0 ? CreateCard(<Vlans vlans={vlans}/>, "Vlans") : <div/>}
                        </Col>
                        <Col xl={5}>
                          <Row>
                            {trunks.length > 0 ? CreateCard(<Trunks ports={trunks}/>, "Trunks") : <div/>}
                          </Row>
                          <Row>
                              {access.length > 0 ? CreateCard(<AccessPorts ports={access}/>, "Access Ports"): <div/>}
                          </Row>
                          <Row>
                              {mac_addresses.length > 0 ? CreateCard(<MacTable macs={mac_addresses}/>, "MAC-Addresses") : <div/>}
                          </Row>
                        </Col>
                    </Row>
                    </div>

                     
                     
                 

            </Container>
}        


    
  
  