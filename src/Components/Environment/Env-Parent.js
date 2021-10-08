import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import {useRecoilState} from 'recoil';
import { CpuUsage} from './cpuUsages'
import { Sensors} from './sensors'
import { ErrorBoundary } from  'react-error-boundary'
import { CreateCard } from '../Other/jsxCard';
import { Navigation } from '../Other/navbar';
import { NavigationFallback } from "../Other/navbarError";
import { IsErrorFallback } from "../Other/errorComponent";
import { PoeConnections } from './poe'
import { Transceivers } from './transceivers'
import { TransceiversInv } from './transieverInventory'
import {AES, enc}from 'crypto-js';
import {encytpKey}  from '../../App'


export function Environment(){
  const [decrypt, setDecrypt] = useRecoilState(encytpKey);
  const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
  const { isLoading, error, data, isFetching } = useQuery('pollEnv', async () => {
    const response = await axios.post('/pollEnv', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
    'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')})

    return response.data

    },
    {
      refetchInterval: 10000, cacheTime: 0
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
          return  <Container fluid>
                      <ErrorBoundary FallbackComponent={NavigationFallback}>
                        <Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching} cpu={data.cpu} mem={data.mem}/>
                      </ErrorBoundary>
                      <Row>
                      <Col xl={8}>
                          {CreateCard(<Transceivers transceivers={data.transceivers}/>, "SFP Statuses")}
                      </Col>
                      <Col xl={4}>
                          {CreateCard(<TransceiversInv transceivers={data.transceivers}/>, "SFP Inventory")}
                      </Col>
                      </Row>
                      <Row>
                          <Col xl={4}>
                              {CreateCard(<Sensors env={data.env}/>, 'Environmental Stats')}
                              {CreateCard(<PoeConnections poe={data.poe}/>, 'Poe Interface')}
                          </Col>
                        <Col xl={8}>
                          <ErrorBoundary FallbackComponent={IsErrorFallback}>
                            <CpuUsage cpu={data.cpu} mem={data.mem}/>
                          </ErrorBoundary>
                        </Col>
                      </Row>
                  </Container>
        }
    else if (isLoading){
      return  <div>
                <h4 class="text-center fade-in" style={{marginTop: 100}}>Collecting Data From {localStorage.getItem('ip')}</h4>
                <div class="loader text-center"></div>
            </div>
    }
    


  }
    
  
  
