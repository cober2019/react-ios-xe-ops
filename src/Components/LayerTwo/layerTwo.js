import React, { useRef } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { DpNeighbors} from '../Other/dp_neighbors'
import { GlobalSpanTreeHtml} from '../Other/chartConfigs'
import { MacTable} from './macAddress'
import { SpanTable} from './spanTree'
import { Trunks} from './trunks'
import { AccessPorts} from './accessPorts'
import { Vlans} from './vlans'
import { Navbar } from '../Other/navbar';
import { ErrorBoundary } from '../Other/errorBoundry';


export  function LayerTwo(props){
  const bridgeGlobalTble = useRef(false)
  const { isLoading, error, data } = useQuery('pollL2Page', async () => {
    
    const response = await axios.post('/pollL2Page',{'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
    'password': localStorage.getItem('password'), 'port': localStorage.getItem('port')}, {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}})
    
    bridgeGlobalTble.current = GlobalSpanTreeHtml(response.data.span[1]['Cisco-IOS-XE-spanning-tree-oper:stp-global'])
    return response.data

    },
    {
      refetchInterval: 5000,
    }
)

if (error){
  return  <div>
            <Navbar update={data} ip={localStorage.getItem('ip')}/>
            <h4 class="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
            <div class="warning-loader text-center"></div>
        </div>
}
else if (data){
  return <div className="container-fluid">
          <Navbar update={data} ip={localStorage.getItem('ip')}/>
          <div className="card border-0 mt-3 mb-3 bg-dark">
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
                              <div class="tab-pane"id="spanports" role="tabpanel">     
                              { data.span[0]['Cisco-IOS-XE-spanning-tree-oper:stp-details']['stp-detail'].map(instance => (
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
                          <Vlans vlans={data.vlans}/>
                        </ErrorBoundary>
                        <div className="col-xl-5">
                          <div className="row">
                            <ErrorBoundary>
                              <Trunks ports={data.trunks}/>
                            </ErrorBoundary>
                          </div>
                          <div className='row'>
                            <ErrorBoundary>
                              <AccessPorts ports={data.access}/>
                            </ErrorBoundary>
                          </div>
                            <div className='row'>
                            <ErrorBoundary>
                              <MacTable macs={data.macs}/>
                            </ErrorBoundary>
                          </div>
                        </div>
                      </div>
                    </div>
}
else if (isLoading){
  return  <div>
            <h4 class="text-center fade-in" style={{marginTop: 100}}>Collecting L2 data for {localStorage.getItem('ip')}</h4>
            <div class="loader text-center"></div>
        </div>
}

}
    
  
  