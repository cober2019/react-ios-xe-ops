import React from 'react';
import axios from 'axios';
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {useRecoilState} from 'recoil';
import { Navigation } from '../Other/navbar'
import { SlaStats } from './ipslastats'
import { BuildSlaTopologies } from './slatopologies'
import { useQuery } from 'react-query';
import { ErrorBoundary } from  'react-error-boundary'
import {AES, enc}from 'crypto-js';
import {encytpKey}  from '../../App'
import { CreateCard } from '../Other/jsxCard';
import { NavigationFallback } from "../Other/navbarError";
import { pageLoader } from '../Other/pageLoader';

export  function IpSlas(){
  const [decrypt] = useRecoilState(encytpKey);
  const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
  const { isLoading, error, data, isFetching } = useQuery(localStorage.getItem('ip') + 'getipsla', async () => {
        const data = await axios.post('/getipsla', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
        'password':  passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')})

        return data.data

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
                    <Row>
                        {CreateCard(<SlaStats slas={data.slas}/>, "IP SLAs")}
                    </Row>
                    <Row>
                        { data.slas.map(sla => (
                            <Col xl>
                              <ErrorBoundary>
                               {CreateCard(<BuildSlaTopologies sla={sla} localIp={localStorage.getItem('ip')}/>, "SLA ID: " + sla['oper-id'])}
                              </ErrorBoundary>
                          </Col>
                        ))}
                        </Row>
                  </Container>
  }
  else if (isLoading){
    return  <Container className="center-login" fluid>
              {pageLoader}
            </Container>
  }

}
    
  