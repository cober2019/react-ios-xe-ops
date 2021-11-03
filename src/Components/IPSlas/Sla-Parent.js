import React from 'react';
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {useRecoilState} from 'recoil';
import { Navigation } from '../Other/navbar'
import { SlaStats } from './ipslastats'
import { BuildSlaTopologies } from './slatopologies'
import { useQuery } from 'react-query';
import { ErrorBoundary } from  'react-error-boundary'
import { encytpKey, client}  from '../../App'
import { CreateCard } from '../Other/jsxCard';
import { NavigationFallback } from "../Other/navbarError";
import { PageLoader } from '../Other/pageLoader';
import { ApiRequest } from "../Other/axiosRequests";

export  function IpSlas(){
  const [decryptKey] = useRecoilState(encytpKey);
  const { isLoading, error, data, isFetching } = useQuery(localStorage.getItem('ip') + 'getipsla', async () => {

        const response = await ApiRequest(decryptKey, '/getipsla')

        return response.data

        },
        {
          refetchInterval: 5000
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
    return  <>
              {PageLoader(localStorage.getItem('ip'), localStorage.getItem('serial'), localStorage.getItem('model'), localStorage.getItem('uptime'), localStorage.getItem('software'))}
            </>
  }

}
    
  