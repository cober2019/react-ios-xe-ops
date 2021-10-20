import axios from 'axios';
import { useQuery } from 'react-query';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {AES, enc} from 'crypto-js';
import {useRecoilState} from 'recoil';
import { Navigation } from '../Other/navbar';
import { RibInfo} from './getRibs';
import { RibDiff} from './ribDiff';
import { RoutingProtocols} from './protocols';
import {encytpKey}  from '../../App'
import { CreateCard } from '../Other/jsxCard';
import { NavigationFallback } from "../Other/navbarError";
import { ErrorBoundary } from  'react-error-boundary'
import { PageLoader } from '../Other/pageLoader';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export function RibIndex(){
    const [decrypt] = useRecoilState(encytpKey);
    const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
    const { isLoading, error, data, isFetching  } = useQuery(localStorage.getItem('ip') + 'ribStatus', async () => {
      
        const response = await axios.post('/ribStatus',{'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
        'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')}, {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        
        return response.data

        },
        {
        refetchInterval: 10000,
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
                    {CreateCard(<RibInfo routes={data.ribsEntries}/>)}
                    <Row>
                        <Col xl={6}>
                            {CreateCard(<RoutingProtocols protocols={data.protocols}/>, "Protocols")}
                        </Col>
                        <Col xl={6}>
                            {CreateCard(<RibDiff ribs={data.flaps.routes}/>, 'Flapping Routes')}
                        </Col>
                    </Row>
                </Container>
    }
    else if (isLoading){
        return  <div>
                    {PageLoader(localStorage.getItem('ip'), localStorage.getItem('serial'), localStorage.getItem('model'), localStorage.getItem('uptime'), localStorage.getItem('software'))}
                </div>
    }

    }



      
