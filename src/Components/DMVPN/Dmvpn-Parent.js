import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useRecoilState} from 'recoil';
import { ErrorBoundary } from  'react-error-boundary'
import { Ospf } from '../LayerThree/ospf';
import { Navigation } from '../Other/navbar';
import { DmvpnData } from './dmvpnData';
import { useQuery, useQueryClient} from 'react-query';
import {encytpKey, client}  from '../../App'
import { NavigationFallback } from "../Other/navbarError";
import { IsErrorFallback } from "../Other/errorComponent";
import { PageLoader } from '../Other/pageLoader';
import { ApiRequest } from "../Other/axiosRequests";

export  function Dmvpn(){
    const [decryptKey] = useRecoilState(encytpKey);
    const { isLoading, error, data, isFetching } = useQuery(localStorage.getItem('ip') + 'getDmvpn', async () => {

        const response = await ApiRequest(decryptKey, '/getDmvpn')

        return response.data

        },
        {
        refetchInterval: 20000
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
                      <ErrorBoundary  FallbackComponent={IsErrorFallback}><Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching} cpu={data.cpu} mem={data.mem}/></ErrorBoundary>
                </ErrorBoundary>
                <Row className="mb-3">
                        <Col xl>
                        <ErrorBoundary FallbackComponent={IsErrorFallback}>
                            <DmvpnData dmvpn={data.dmvpn} dmvpnInts={data.dmvpnInts} hubs={data.hubs} locations={data.location} routing={data.routing} localIp={localStorage.getItem('ip')}/>
                        </ErrorBoundary>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xl>
                        <ErrorBoundary  FallbackComponent={IsErrorFallback}>
                            {data.dmvpn.length > 0 ? <Ospf neighbors={data.ospf} interfaces={data.ospfInts} topology={data.ospfTopology}/> : <div/>}
                        </ErrorBoundary>
                        </Col>
                    </Row>
                </Container>
}
else if (isLoading){
    return  <div>
                {PageLoader(localStorage.getItem('ip'), localStorage.getItem('serial'), localStorage.getItem('model'), localStorage.getItem('uptime'), localStorage.getItem('software'))}
            </div>
}


}
    
  
  
