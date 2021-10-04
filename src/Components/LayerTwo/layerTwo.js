import React, { useRef } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import {useRecoilState} from 'recoil';
import { DpNeighbors} from '../Other/dp_neighbors'
import { GlobalSpanTreeHtml} from '../Other/chartConfigs'
import { MacTable} from './macAddress'
import { SpanTable} from './spanTree'
import { Trunks} from './trunks'
import { AccessPorts} from './accessPorts'
import { Vlans} from './vlans'
import { Navbar } from '../Other/navbar';
import { ErrorBoundary } from '../Other/errorBoundry';
import {AES, enc}from 'crypto-js';
import { encytpKey } from '../../index'

export  function LayerTwo(props){
  const bridgeGlobalTble = useRef(false) 
  const [decrypt, setDecrypt] = useRecoilState(encytpKey);
  const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
  const { isLoading, error, data, isFetching } = useQuery('pollL2Page', async () => {
    
    const response = await axios.post('/pollL2Page',{'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
    'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')})

    if(response.data.globalSpan){
        bridgeGlobalTble.current = GlobalSpanTreeHtml(response.data.globalSpan)
      }
      
      return response.data

    },
    {
      refetchInterval: 5000,
    }
)

if (error){
  return  <div>
            <Navbar update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
            <h4 class="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
            <div class="warning-loader text-center"></div>
        </div>
}
else if (data){
  return <div className="container-fluid">
          <Navbar update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
          { data.span.length > 0 ? <div><div className="card border-0 mt-3 bg-dark">
                    <div className="card-body">
                      <div className="row">
                        <ul class="nav">
                              <li class="nav-item">
                                  <a href="#spanglobal" class="nav-link text-light show active " data-toggle="tab">Spanning Tree Global</a>
                              </li>
                              <li class="nav-item">
                                  <a href="#spanports" class="nav-link text-light" data-toggle="tab">Per-Vlan Span. Details</a>
                              </li>
                          </ul>
                          <div class="tab-content">
                              <div class="tab-pane" id="spanports" role="tabpanel">     
                              { data.span.map(instance => (
                                    <ErrorBoundary>
                                      <SpanTable span={instance}/>
                                    </ErrorBoundary>
                                  ))}
                                </div>   
                              <div class="tab-pane show active" id="spanglobal" role="tabpanel">      
                                {bridgeGlobalTble.current}
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>  
                    <div className="row">
                      <ErrorBoundary>
                        <DpNeighbors dpNeighbors={data.dpNeighbors}/>
                      </ErrorBoundary>
                    </div>
                    <div className="row">
                        <ErrorBoundary>
                          {data.vlans.length > 0 ? <Vlans vlans={data.vlans}/> : <div/>}
                        </ErrorBoundary>
                        <div className="col-xl-5">
                          <div className="row">
                            <ErrorBoundary>
                              {data.trunks.length > 0 ? <Trunks ports={data.trunks}/> : <div/>}
                            </ErrorBoundary>
                          </div>
                          <div className='row'>
                            <ErrorBoundary>
                              {data.access.length > 0 ? <AccessPorts ports={data.access}/>: <div/>}
                            </ErrorBoundary>
                          </div>
                            <div className='row'>
                            <ErrorBoundary>
                              {data.mac_addresses.length > 0 ? <MacTable macs={data.macs}/> : <div/>}
                            </ErrorBoundary>
                          </div>
                        </div>
                      </div>
                    </div>
                     : <div className="alert alert-dark text-center mt-3" role="alert"><h5>No Layer Two Data Found</h5></div>}
                     </div>
}
else if (isLoading){
  return  <div>
            <h4 class="text-center fade-in" style={{marginTop: 100}}>Collecting L2 data for {localStorage.getItem('ip')}</h4>
            <div class="loader text-center"></div>
        </div>
}

}
    
  
  