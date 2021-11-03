import React from 'react';
import { useQuery, useQueryClient } from 'react-query'
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {useRecoilState} from 'recoil';
import { InterfaceCard} from '../Index/interfaceCard'
import { Navigation } from '../Other/navbar';
import { NavigationFallback } from '../Other/navbarError';
import { CreateCard } from '../Other/jsxCard';
import { IsErrorFallback } from "../Other/errorComponent";
import { ErrorBoundary } from  'react-error-boundary'
import { PageLoader } from '../Other/pageLoader';
import { BandwidthDiff } from '../Other/bandwidthFunctions';
import { encytpKey, client}  from '../../App'
import { ShowInterface } from '../Modals/interfaceModal';
import { ModifyInterface } from '../Forms/interfaceForm';
import { ApiRequest } from "../Other/axiosRequests";

export function LiveInterfaces(){
  const [decryptKey] = useRecoilState(encytpKey);
  const cache = React.useRef(useQueryClient())
  const [modalShow, setModalShow] = React.useState(false);
  const [interfaceShow, setInterfaceShow] = React.useState(false);
  const [selectInterface, setSelectInterface] = React.useState(undefined)
  const { isLoading, error, data, isFetching } = useQuery(localStorage.getItem('ip') + 'liveinterfaces', async () => {

        const response = await ApiRequest(decryptKey, '/liveinterfaces')
        const calulatedBandwdithDiff = BandwidthDiff(cache, response.data)

        if(selectInterface !== undefined){
            Object.values(calulatedBandwdithDiff.interfaces).map(int => {
              if(int.data.name === selectInterface.interface && modalShow){
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

  const closeInterface = () => {
    setSelectInterface(undefined)
    setInterfaceShow(false)
    setModalShow(false)
  }

  if (error){
    return  <>
              <ErrorBoundary  FallbackComponent={NavigationFallback}>
                <Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
              </ErrorBoundary>
              <h4 className="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
              <div className="warning-loader text-center"></div>
            </>
  }
  else if (data){
        return  <Container fluid>
                      <ErrorBoundary  FallbackComponent={NavigationFallback}>
                        <Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching} cpu={data.cpu} mem={data.mem}/>
                        </ErrorBoundary>
                        <Row>
                        <Col xl={2}>
                          <Row>
                            <button type="button" style={{marginBottom: "10px"}} className="btn btn-success btn-md" onClick={()=> setInterfaceShow(true)}>Add Interface</button>
                            { Object.values(data.interfaces).map((value) => (
                                  <button type="button" style={{marginBottom: "10px"}} className="btn btn-success btn-md" onClick={()=> interfaceFocus(value)}>{value.interface}</button>
                                  ))}
                          </Row>
                        </Col>
                        <Col xl={10}>
                          <Row>
                              { Object.values(data.interfaces).map((value) => (
                                  <Col xl={4}>
                                  {CreateCard(<InterfaceCard key={value.interface} qos={value.qos} value={value.data}/>, value.interface)}
                                  </Col>
                              ))}
                          </Row>
                        </Col>
                        </Row>
                        {modalShow ? <ShowInterface interface={selectInterface.interface} component={<InterfaceCard key={selectInterface.interface} qos={selectInterface.qos} value={selectInterface.data}/>} show={modalShow} onHide={() => closeInterface()}/>
                          :  
                          <></>}

                        {interfaceShow ? <ShowInterface component={<ModifyInterface interfaces={data.interfaces}/>} show={interfaceShow} onHide={() => closeInterface()}/>
                          :  
                          <></>}
                </Container>


      }
  else if (isLoading){

    return <>
              {PageLoader(localStorage.getItem('ip'), localStorage.getItem('serial'), localStorage.getItem('model'), localStorage.getItem('uptime'), localStorage.getItem('software'))}
            </>
  }


  }
    