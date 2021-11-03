import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useRecoilState} from 'recoil';
import { Ospf } from './ospf';
import { Bgp } from './bgp';
import { Navigation } from '../Other/navbar'
import { useQuery } from 'react-query';
import { ErrorBoundary } from  'react-error-boundary'
import {encytpKey, client}  from '../../App'
import { NavigationFallback } from "../Other/navbarError";
import { IsErrorFallback } from "../Other/errorComponent";
import { ApiRequest } from "../Other/axiosRequests";
import { PageLoader } from '../Other/pageLoader';


export  function Routing(){
    const [decryptKey] = useRecoilState(encytpKey);
    const { isLoading, error, data, isFetching } = useQuery(localStorage.getItem('ip') + 'pollRouting', async () => {

        const response = await ApiRequest(decryptKey, '/pollRouting')

        return response.data

        },
        {
        refetchInterval: 5000,
        }
  )

  if (error){
    return  <>
                <ErrorBoundary FallbackComponent={NavigationFallback}>
                  <Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
                </ErrorBoundary>
                <h4 classname="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
                <div classname="warning-loader text-center"></div>
            </>
}
else if (data){
    return <Container fluid>
                    <ErrorBoundary FallbackComponent={IsErrorFallback}>
                          <Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching} cpu={data.cpu} mem={data.mem}/>
                    </ErrorBoundary>
                    <Row>
                        <Col xl>
                        <ErrorBoundary  FallbackComponent={IsErrorFallback}>
                             <Ospf neighbors={data.ospf} interfaces={data.ospfInts} topology={data.ospfTopology}/>
                        </ErrorBoundary>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl>
                        <ErrorBoundary  FallbackComponent={IsErrorFallback}>
                            <Bgp neighbors={data.bgp} details={data.bgpDetails} topology={data.bgpTopology} prefixLists={data.prefixLists} routeMaps={data.routeMaps}/>
                        </ErrorBoundary>
                        </Col>
                    </Row>
                </Container>
}
else if (isLoading){
    return  <>
                {PageLoader(localStorage.getItem('ip'), localStorage.getItem('serial'), localStorage.getItem('model'), localStorage.getItem('uptime'), localStorage.getItem('software'))}
            </>
}

}
    
  
  