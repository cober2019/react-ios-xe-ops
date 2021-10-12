import React from 'react';
import { useQuery } from 'react-query'
import {encytpKey}  from '../../App'
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import axios from 'axios';
import {useRecoilState} from 'recoil';
import { InterfaceCard} from '../Index/interfaceCard'
import { Navigation } from '../Other/navbar';
import { CreateCard } from '../Other/jsxCard';
import { AES, enc }from 'crypto-js';
import { IsErrorFallback } from "../Other/errorComponent";
import { ErrorBoundary } from  'react-error-boundary'
import { pageLoader } from '../Other/pageLoader';

export function LiveInterfaces(){
  const [decrypt] = useRecoilState(encytpKey);
  const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
  const { isLoading, error, data, isFetching } = useQuery(localStorage.getItem('ip') + 'liveinterfaces', async () => {
  const data = await axios.post('/liveinterfaces', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
  'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')})

  return data.data

  },
  {
    refetchInterval: 5000
  }
  )
  console.log(data)
  if (error){
    return  <div>
              <Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
              <h4 className="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
              <div className="warning-loader text-center"></div>
            </div>
  }
  else if (data){

        return  <Container fluid>
                        <ErrorBoundary  FallbackComponent={IsErrorFallback}>
                          <Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching} cpu={data.cpu} mem={data.mem}/>
                          </ErrorBoundary>
                        <Row>
                            { Object.values(data.interfaces).map((value) => (
                                <Col xl={4}>
                                {CreateCard(<InterfaceCard key={value.interface} qos={value.qos} value={value.data}/>, value.interface)}
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
    