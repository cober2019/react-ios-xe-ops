import React from 'react';
import { useQuery } from 'react-query'
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import axios from 'axios';
import {useRecoilState} from 'recoil';
import { ErrorBoundary } from  'react-error-boundary'
import { Arps} from './arps'
import { InterfaceTable} from './InterfacesTable'
import { Hsrp} from './hsrp'
import { DpNeighbors} from '../Other/dp_neighbors'
import { CreateCard } from '../Other/jsxCard';
import { Navigation } from '../Other/navbar';
import { AES, enc }from 'crypto-js';
import { NavigationFallback } from "../Other/navbarError";
import {encytpKey}  from '../../App'

export function Index(){
  const [decrypt] = useRecoilState(encytpKey);
  const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
  const { isLoading, error, data, isFetching } = useQuery('indexData', async () => {
  const data = await axios.post('/pollIndexPage', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
                    'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')})

  return data.data

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
              <h4 className="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
              <div className="warning-loader text-center"></div>
            </div>
  }
  else if (data){

        return  <Container fluid>
                    <ErrorBoundary FallbackComponent={NavigationFallback}>
                      <Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching} cpu={data.cpu} mem={data.mem}/>
                    </ErrorBoundary>
                   {CreateCard(<DpNeighbors dpNeighbors={data.dp}/>)}
                    <Card bg="dark" className="mb-3">
                      <Card.Body>
                      <Tabs  defaultActiveKey="Interfacetable" id="interfaces">
                        <Tab eventKey="Interfacetable" title="Interface Table">
                          {CreateCard(<InterfaceTable interfaces={data.interfaces}/>)}
                          </Tab>
                        <Tab eventKey="arp" title="ARP">
                          {CreateCard(<Arps arps={data.arps}/>, "ARPs")}
                        </Tab>
                      </Tabs>
                      </Card.Body>
                    </Card>
                      {data.hsrp.length > 0 ? CreateCard(<Hsrp hsrp={data.hsrp} localIp={localStorage.getItem('ip')}/>, "HSRP Topology") : <div/>}
                  </Container>
      }
  else if (isLoading){

    return  <div>
              <h4 className="text-center fade-in" style={{marginTop: 100}}>Collecting Data From {localStorage.getItem('ip')}</h4>
              <div className="loader text-center"></div>
          </div>
  }


  }
    
  
  
