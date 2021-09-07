import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Arps} from './arps'
import { InterfaceCard} from './interfaceCard'
import { Qos} from './qos'
import { InterfaceTable} from './InterfacesTable'
import { CpuUsage} from './cpuUsages'
import { Envirmoment} from './enviroment'
import { DpNeighbors} from './dp_neighbors'
import { ErrorBoundary } from './errorBoundry';
import { Navbar } from './navbar';

export function Index(props){
  const [update, setUpdate] = useState(0)
  const errorRef = useRef(false)

  useEffect(() => {

    const source = axios.CancelToken.source()

    if(update !== 0){
      
      axios.post('/pollIndexPage',
      {'ip': localStorage.getItem('ip'), 
      'username': localStorage.getItem('username'), 
      'password': localStorage.getItem('password'), 
      'port': localStorage.getItem('port')},
      {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(data => {
      
      localStorage.setItem('interfaces', JSON.stringify(data.data.interfaces));
      localStorage.setItem('arps', JSON.stringify(data.data.arps));
      localStorage.setItem('dpNeighbors', JSON.stringify(data.data.dp));
      localStorage.setItem('cpu', JSON.stringify(data.data.cpu));
      localStorage.setItem('mem', JSON.stringify(data.data.mem));
      localStorage.setItem('env', JSON.stringify(data.data.env));

      errorRef.current = false
      let render = update + 1
      setUpdate(render)

    }).catch(() => {
      errorRef.current = true
      let render = update + 1
      setUpdate(render)
    });
  }

  return () => {
    source.cancel()}

  }, [update])
  
useEffect(() => {
  
  if(update === 0){
    localStorage.setItem('ip', props.ip);
    localStorage.setItem('username', props.username);
    localStorage.setItem('password', props.password);
    localStorage.setItem('port', props.port);
    localStorage.setItem('token', props.token);
    setUpdate(1)
  }

}, [])

if (errorRef.current){
  return  <div>
            <Navbar update={update} ip={localStorage.getItem('ip')}/>
            <h4 class="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
            <div class="warning-loader text-center"></div>
          </div>
}
else if (update >= 2  && !errorRef.current){
      return  <div className="container-fluid">
                  <Navbar update={update} ip={localStorage.getItem('ip')}/>
                  <ErrorBoundary>
                    <DpNeighbors dpNeighbors={JSON.parse(localStorage.getItem('dpNeighbors'))}/>
                  </ErrorBoundary>
                  <div className="card border-0 mt-3 mb-3 bg-dark">
                    <div className="card-body">
                      <div className="row">
                        <ul class="nav">
                              <li class="nav-item">
                                  <a href="#table" class="nav-link text-light" data-toggle="tab">Interface Table</a>
                              </li>
                              <li class="nav-item">
                                  <a href="#chart" class="nav-link show active text-light" data-toggle="tab">Interface Chart</a>
                              </li>
                              <li class="nav-item">
                                  <a href="#qos" class="nav-link text-light" data-toggle="tab">Interface Qos</a>
                              </li>
                              <li class="nav-item">
                                  <a href="#arps" class="nav-link text-light" data-toggle="tab">ARPs</a>
                              </li>
                          </ul>
                          <div class="tab-content">
                              <div class="tab-pane " id="chart" role="tabpanel">
                                <div className="row">
                                { Object.values(JSON.parse(localStorage.getItem('interfaces'))).map((value) => (
                                    <ErrorBoundary>
                                      <InterfaceCard key={value.name} qos={value.qos} value={value.data} arps={value.arps}/>
                                    </ErrorBoundary>
                                ))}
                              </div>
                              </div>
                              <div class="tab-pane show active" id="table" role="tabpanel">
                                <ErrorBoundary>
                                  <InterfaceTable interfaces={JSON.parse(localStorage.getItem('interfaces'))}/>
                                </ErrorBoundary>
                              </div> 
                              

                              <div class="tab-pane" id="arps" role="tabpanel">
                                <ErrorBoundary>
                                  <Arps arps={JSON.parse(localStorage.getItem('arps'))}/>
                                </ErrorBoundary>
                              </div>           
                          </div>
                        </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-3">
                      <ErrorBoundary>
                        <Envirmoment env={JSON.parse(localStorage.getItem('env'))}/>
                      </ErrorBoundary>
                    </div>
                    <div className="col-xl-9">
                          <ErrorBoundary>
                            <CpuUsage cpu={JSON.parse(localStorage.getItem('cpu'))} mem={JSON.parse(localStorage.getItem('mem'))}/>
                          </ErrorBoundary>
                      </div>
                    </div>
              </div>
    }
else if (update < 2){
  return  <div>
            <h4 class="text-center fade-in" style={{marginTop: 100}}>Collecting Data for {localStorage.getItem('ip')}</h4>
            <div class="loader text-center"></div>
        </div>
}


  }
    
  
  