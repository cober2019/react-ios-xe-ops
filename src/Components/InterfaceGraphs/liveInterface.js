import React from 'react';
import { useQuery } from 'react-query'
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
import { PageLoader } from '../Other/pageLoader';
import { BandwidthDiff } from '../Other/bandwidthFunctions';
import {encytpKey, client}  from '../../App'
import { ShowInterfaceOverlay } from './interfaceOverlay';

export function LiveInterfaces(){
  const [decrypt] = useRecoilState(encytpKey);
  const [cache] = useRecoilState(client);
  const [modalShow, setModalShow] = React.useState(false);
  const [selectInterface, setSelectInterface] = React.useState(undefined)
  const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
  const { isLoading, error, data, isFetching } = useQuery(localStorage.getItem('ip') + 'liveinterfaces', async () => {
  const data = await axios.post('/liveinterfaces', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
              'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')})

        const calulatedBandwdithDiff = BandwidthDiff(cache, data.data)
        if(selectInterface !== undefined){
            Object.values(calulatedBandwdithDiff.interfaces).map(int => {
              if(int.data.name === selectInterface.interface){
                setSelectInterface(int)
              }
          })
        }

        return calulatedBandwdithDiff
      
  },
  {
    refetchInterval: 5000
  }
  )

  const interfaceFocus = (interfaceDetails) => {
    setSelectInterface(interfaceDetails)
    setModalShow(true)
  }

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
                      <Col xl={2}>
                        <Row>
                          { Object.values(data.interfaces).map((value) => (
                                <button type="button" style={{marginBottom: "10px"}} className="btn btn-success btn-md" onClick={()=> interfaceFocus(value)}>{value.interface}</button>
                                ))}
                        </Row>
                      </Col>
                      <Col xl={10}>
                        <Row>
                            { Object.values(data.interfaces).map((value) => (
                                <Col xl={4}>
                                {CreateCard(<InterfaceCard key={value.interface} qos={value.qos} value={value.data}/>, value.interface, value.interface)}
                                </Col>
                            ))}
                        </Row>
                      </Col>
                      </Row>
                      {modalShow ? <ShowInterfaceOverlay interface={selectInterface.interface} component={<InterfaceCard key={selectInterface.interface} qos={selectInterface.qos} value={selectInterface.data}/>} show={modalShow} onHide={() => setModalShow(false)}/>
                        :  
                        <div></div>}
              </Container>


      }
  else if (isLoading){

    return <div>
              {PageLoader(localStorage.getItem('ip'), localStorage.getItem('serial'), localStorage.getItem('model'), localStorage.getItem('uptime'), localStorage.getItem('software'))}
            </div>
  }


  }
    