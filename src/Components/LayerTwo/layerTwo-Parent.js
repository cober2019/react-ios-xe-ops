import React, { useRef } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useRecoilState} from 'recoil';
import { DpNeighbors} from '../Other/dp_neighbors'
import { GlobalSpanTreeHtml} from '../Other/chartConfigs'
import { MacTable} from './macAddress'
import { SpanTable} from './spanTree'
import { Trunks} from './trunks'
import { AccessPorts} from './accessPorts'
import { Vlans} from './vlans'
import { Navigation } from '../Other/navbar';
import { ErrorBoundary } from  'react-error-boundary'
import { AES, enc}from 'crypto-js';
import {encytpKey}  from '../../App'
import { CreateCard } from '../Other/jsxCard';
import { Card } from 'react-bootstrap';
import { NavigationFallback } from "../Other/navbarError";
import { IsErrorFallback } from "../Other/errorComponent";
import { PageLoader } from '../Other/pageLoader';

export  function LayerTwo(){
  const bridgeGlobalTble = useRef(false) 
  const [decrypt] = useRecoilState(encytpKey);
  const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
  const { isLoading, error, data, isFetching } = useQuery(localStorage.getItem('ip') +'pollL2Page', async () => {
    
    const response = await axios.post('/pollL2Page',{'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
    'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')})
    console.log(response)

    try{
        bridgeGlobalTble.current = GlobalSpanTreeHtml(response.data.globalSpan)
      }
    catch{}
      
      return response.data

    },
    {
      refetchInterval: 5000
    }
)

if (error){
  return  <div>
                <ErrorBoundary FallbackComponent={NavigationFallback}>
                  <Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
                </ErrorBoundary>
            <h4 classname="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
            <div classname="warning-loader text-center"></div>
        </div>
}
else if (data){

  return <Container fluid>
            <ErrorBoundary FallbackComponent={NavigationFallback}>
                <Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching} cpu={data.cpu} mem={data.mem}/>
            </ErrorBoundary>
            
                <div>
                  <Card bg={"dark"} className="mb-3">
                    <Card.Body>
                      <Tabs defaultActiveKey="globalvlan" id="spanningtre" bg={"success"}>
                      <Tab eventKey="globalvlan" title="Global Setting">
                            {bridgeGlobalTble.current}
                          </Tab>
                          {data.span.hasOwnProperty.key ? <Tab eventKey="pervlan" title="Spanning Tree">
                          { data.span.map(instance => (<ErrorBoundary FallbackComponent={IsErrorFallback}><SpanTable span={instance}/></ErrorBoundary>))}
                          </Tab> : <div/>}
                      </Tabs>
                    </Card.Body>
                  </Card>
                      <Row>
                        <Col xl={12}>
                          {CreateCard(<DpNeighbors dpNeighbors={data.dpNeighbors}/>)}
                        </Col>
                      </Row>
                      <Row>
                        <Col xl={7}>
                            {data.vlans.length > 0 ? CreateCard(<Vlans vlans={data.vlans}/>, "Vlans") : <div/>}
                        </Col>
                        <Col xl={5}>
                          <Row>
                            {data.trunks.length > 0 ? CreateCard(<Trunks ports={data.trunks}/>, "Trunks") : <div/>}
                          </Row>
                          <Row>
                              {data.access.length > 0 ? CreateCard(<AccessPorts ports={data.access}/>, "Access Ports"): <div/>}
                          </Row>
                          <Row>
                              {data.mac_addresses.length > 0 ? CreateCard(<MacTable macs={data.mac_addresses}/>, "MAC-Addresses") : <div/>}
                          </Row>
                        </Col>
                    </Row>
                    </div>

                     
            </Container>
}        
else if (isLoading){
  return  <Container className="center-login" fluid>
              {PageLoader(localStorage.getItem('ip'), localStorage.getItem('serial'), localStorage.getItem('model'), localStorage.getItem('uptime'), localStorage.getItem('software'))}
          </Container>
}
}

    
  
  