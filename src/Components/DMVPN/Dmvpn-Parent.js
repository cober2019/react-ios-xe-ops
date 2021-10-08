import React from 'react';
import axios from 'axios';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {AES, enc} from 'crypto-js';
import {useRecoilState} from 'recoil';
import { ErrorBoundary } from  'react-error-boundary'
import { Ospf } from '../LayerThree/ospf';
import { Navigation } from '../Other/navbar';
import { DmvpnData } from './dmvpnData';
import { useQuery } from 'react-query';
import {encytpKey}  from '../../App'
import { NavigationFallback } from "../Other/navbarError";
import { IsErrorFallback } from "../Other/errorComponent";

export  function Dmvpn(){
    const [decrypt] = useRecoilState(encytpKey);
    const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
    const { isLoading, error, data, isFetching } = useQuery('getDmvpn', async () => {

        const response = await axios.post('/getDmvpn',{'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
        'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')})
        console.log(response.data)

        return response.data

        },
        {
        refetchInterval: 20000, cacheTime: 0
        }
  )


  if (error){
    return  <div>
                <ErrorBoundary FallbackComponent={NavigationFallback}>
                  <Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
                </ErrorBoundary>
                <h4 class="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
                <div class="warning-loader text-center"></div>
            </div>
}
else if (data){
    return <Container fluid>
                <ErrorBoundary FallbackComponent={NavigationFallback}>
                    <Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching} cpu={data.cpu} mem={data.mem}/>
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
                            {data.ospf.length > 0 ? <Ospf neighbors={data.ospf} interfaces={data.ospfInts} topology={data.ospfTopology}/> : <div/>}
                        </ErrorBoundary>
                        </Col>
                    </Row>
                </Container>
}
else if (isLoading){
    return  <div>
                <h4 class="text-center fade-in" style={{marginTop: 100}}>Collecting DMVPN Toplogy Data From {localStorage.getItem('ip')}</h4>
                <div class="loader text-center"></div>
            </div>
}


}
    
  
  
