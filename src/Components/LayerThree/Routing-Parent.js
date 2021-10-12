import React from 'react';
import axios from 'axios';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useRecoilState} from 'recoil';
import { Ospf } from './ospf';
import { Bgp } from './bgp';
import { Navigation } from '../Other/navbar'
import { useQuery } from 'react-query';
import { ErrorBoundary } from  'react-error-boundary'
import {AES, enc}from 'crypto-js';
import {encytpKey}  from '../../App'
import { NavigationFallback } from "../Other/navbarError";
import { PageLoader } from '../Other/pageLoader';

export  function Routing(){
    const [decrypt] = useRecoilState(encytpKey);
    const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
    const { isLoading, error, data, isFetching } = useQuery(localStorage.getItem('ip') + 'pollRouting', async () => {
    const response = await axios.post('/pollRouting',{'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
    'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')})
    return response.data

    },
    {
    refetchInterval: 5000,
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
                    <Row className="mb-3">
                        <Col xl>
                        <ErrorBoundary  FallbackComponent={NavigationFallback}>
                             <Ospf neighbors={data.ospf} interfaces={data.ospfInts} topology={data.ospfTopology}/>
                        </ErrorBoundary>
                        </Col>
                    </Row>
                    <Row className="mb-3 mt-3">
                        <Col xl>
                        <ErrorBoundary  FallbackComponent={NavigationFallback}>
                            <Bgp neighbors={data.bgp} details={data.bgpDetails} topology={data.bgpTopology}/>
                        </ErrorBoundary>
                        </Col>
                    </Row>
                </Container>
}
else if (isLoading){
    return  <Container className="center-login" fluid>
              {PageLoader(localStorage.getItem('ip'), localStorage.getItem('serial'), localStorage.getItem('model'), localStorage.getItem('uptime'), localStorage.getItem('software'))}
            </Container>
}

}
    
  
  