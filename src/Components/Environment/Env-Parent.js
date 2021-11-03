import React from 'react';
import { useQuery } from 'react-query';
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
import { ApiRequest } from "../Other/axiosRequests";
import { IsErrorFallback } from "../Other/errorComponent";
import { PoeConnections } from './poe'
import { Transceivers } from './transceivers'
import { TransceiversInv } from './transieverInventory'
import { PageLoader } from '../Other/pageLoader';
import {encytpKey}  from '../../App'


export function Environment(){
  const [decryptKey] = useRecoilState(encytpKey);
  const { isLoading, error, data, isFetching } = useQuery(localStorage.getItem('ip') + 'pollEnv', async () => {
    
        const response = await ApiRequest(decryptKey, '/pollEnv')

        return response.data

        },
        {
          refetchInterval: 10000
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
          return  <Container fluid>
                      <ErrorBoundary FallbackComponent={NavigationFallback}>
                          <ErrorBoundary  FallbackComponent={IsErrorFallback}><Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching} cpu={data.cpu} mem={data.mem}/></ErrorBoundary>
                      </ErrorBoundary>
                      <Row>
                          <Col xl={8}>
                          <ErrorBoundary FallbackComponent={IsErrorFallback}>
                            <CpuUsage cpu={data.cpu} mem={data.mem}/>
                          </ErrorBoundary>
                          {CreateCard(<Transceivers transceivers={data.transceivers}/>, "SFP Statuses")}  
                          </Col>
                        <Col xl={4}>
                          {CreateCard(<Sensors env={data.env}/>, 'Environmental Stats')}
                          {CreateCard(<PoeConnections poe={data.poe}/>, 'Poe Interface')}
                          {CreateCard(<TransceiversInv transceivers={data.transceivers}/>, "SFP Inventory")}
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
    
  
  
