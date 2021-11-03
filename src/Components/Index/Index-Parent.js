import React from 'react';
import { useQuery, useQueryClient } from 'react-query'
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import {useRecoilState} from 'recoil';
import { ErrorBoundary } from  'react-error-boundary'
import { Arps} from './arps'
import { InterfaceTable} from './InterfacesTable'
import { Qos} from './qos'
import { Hsrp} from './hsrp'
import { DpNeighbors} from '../Other/dp_neighbors'
import { CreateCard } from '../Other/jsxCard';
import { Navigation } from '../Other/navbar';
import { PageLoader } from '../Other/pageLoader';
import { NavigationFallback } from "../Other/navbarError";
import { IsErrorFallback } from "../Other/errorComponent";
import { ModifyInterface } from '../Forms/interfaceForm';
import { BandwidthDiff } from '../Other/bandwidthFunctions';
import { ApiRequest } from '../Other/axiosRequests';
import {encytpKey, client}  from '../../App'

export function Index(){
  const [decryptKey] = useRecoilState(encytpKey);
  const cache = React.useRef(useQueryClient())
  const { isLoading, error, data, isFetching } = useQuery(localStorage.getItem('ip') + 'indexData', async () => {
    
        const response = await ApiRequest(decryptKey, '/pollIndexPage')
        const calulatedBandwdithDiff = BandwidthDiff(cache, response.data)

        return calulatedBandwdithDiff

        },
        {
          refetchInterval: 2000
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
                    <Card bg="dark" className="mb-3 overflow-auto" >
                      <Card.Body>
                      <Tabs  defaultActiveKey="Interfacetable" id="interfaces" className="mb-3">
                        <Tab eventKey="Interfacetable" title="Interface Table">
                          <InterfaceTable interfaces={data.interfaces}/>
                        </Tab>
                        <Tab eventKey="modifyInt" title="Add/Modify Interface">
                          {CreateCard(<ModifyInterface interfaces={data.interfaces}/>)}
                        </Tab>
                      </Tabs>
                      </Card.Body>
                    </Card>
                    <Card bg={"dark"} className="mb-3 overflow-auto">
                      <Card.Body>
                      { Object.values(data.interfaces).map(interfaceDetail => (
                        <ErrorBoundary FallbackComponent={IsErrorFallback}>
                            {interfaceDetail.qos.length !== 0 ? <Qos key={interfaceDetail.interface.name} qos={interfaceDetail.qos} interface={interfaceDetail }/> : <></>}
                        </ErrorBoundary>
                        ))}
                      </Card.Body>
                    </Card>
                    {CreateCard(<Arps arps={data.arps}/>, "ARPs")}
                    {CreateCard(<DpNeighbors dpNeighbors={data.dp}/>)}
                    {data.hsrp.length > 0 ? CreateCard(<Hsrp hsrp={data.hsrp} localIp={localStorage.getItem('ip')}/>, "HSRP Topology") : <div/>}
                  </Container>
      }
  else if (isLoading){

    return  <>
              {PageLoader(localStorage.getItem('ip'), localStorage.getItem('serial'), localStorage.getItem('model'), localStorage.getItem('uptime'), localStorage.getItem('software'))}
            </>
  }


  }
    
  
  
