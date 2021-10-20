import React from 'react';
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Navigation } from '../../Other/navbarError'
import { SlaStats } from './ipslastats'
import { BuildSlaTopologies } from './slatopologies'
import { ErrorBoundary } from  'react-error-boundary'
import { CreateCard } from '../../Other/jsxCard';
import { NavigationFallback } from "../../Other/navbarError";

export  function IpSlas(props){
  const slas = props.slas

      return <Container fluid>
                  <ErrorBoundary FallbackComponent={NavigationFallback}>
                    <Navigation update={slas} ip={localStorage.getItem('ip')}/>
                  </ErrorBoundary>
                <Row>
                    {CreateCard(<SlaStats slas={slas}/>, "IP SLAs")}
                </Row>
                <Row>
                    { slas.map(sla => (
                        <Col xl>
                          <ErrorBoundary>
                            {CreateCard(<BuildSlaTopologies sla={sla} localIp={localStorage.getItem('ip')}/>, "SLA ID: " + sla['oper-id'])}
                          </ErrorBoundary>
                      </Col>
                    ))}
                    </Row>
              </Container>


}
    
  