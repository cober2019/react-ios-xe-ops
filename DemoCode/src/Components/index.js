import React, { useState, useEffect } from 'react';
import { DpData, EnvData, QosData, InterfaceData } from './errorData'
import { PollIndexPage } from './promises'
import { ErrorDataIndex } from './errorData'
import { Qos} from './qos'
import { Arps} from './arps'
import { InterfaceCard} from './interfaceCard'
import { InterfaceTable} from './InterfacesTable'
import { CpuUsage} from './cpuUsages'
import { Envirmoment} from './enviroment'
import { DpNeighbors} from './dp_neighbors'
import { ErrorBoundary } from './errorBoundry';
import { Navbar } from './navbar';


export function Index(props){
  const [update, setUpdate] = useState(0)

  useEffect(() => {
    (async () => {
      try{
        let indexData = await PollIndexPage(localStorage.getItem('ip'), localStorage.getItem('username'), localStorage.getItem('password'), localStorage.getItem('port'))
        localStorage.setItem('interfaces', JSON.stringify(indexData.data.interfaces));        
	localStorage.setItem('arps', JSON.stringify(indexData.data.arps));
        //localStorage.setItem('dpNeighbors', JSON.stringify(indexData.data.dp));
        localStorage.setItem('dpNeighbors', JSON.stringify(DpData));
        localStorage.setItem('cpu', JSON.stringify(indexData.data.cpu));
        localStorage.setItem('mem', JSON.stringify(indexData.data.mem));
        //localStorage.setItem('env', JSON.stringify(indexData.data.env));
        localStorage.setItem('env', JSON.stringify(EnvData()));
        localStorage.setItem('qos', JSON.stringify(QosData()));        
	let render = update + 1
        setUpdate(render)
      }
      catch{
        let errorData = ErrorDataIndex
 	localStorage.setItem('interfaces', JSON.stringify(errorData[0]));
        localStorage.setItem('arps', JSON.stringify(errorData[1]));
        localStorage.setItem('dpNeighbors', JSON.stringify(errorData[2]));
        localStorage.setItem('cpu', JSON.stringify(errorData[3][0]));
        localStorage.setItem('mem', JSON.stringify(errorData[5]));
        localStorage.setItem('env', JSON.stringify(errorData[4]));	
	localStorage.setItem('qos', JSON.stringify(QosData))
        let render = update + 1
        setUpdate(render)
      }
      })()
  }, [update])
  

useEffect(() => {
  localStorage.setItem('ip', props.ip);
  localStorage.setItem('username', props.username);
  localStorage.setItem('password', props.password);
  localStorage.setItem('port', props.port);
  let render = update + 1
  setUpdate(render)
}, [])

console.log(update)
if (update >= 2){
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
                                  <a href="#qos" class="nav-link show active text-light" data-toggle="tab">Interface Qos</a>
                              </li>
                              <li class="nav-item">
                                  <a href="#arps" class="nav-link text-light" data-toggle="tab">ARPs</a>
                              </li>                          </ul>
                          <div class="tab-content">
                              <div class="tab-pane " id="chart" role="tabpanel">
                                <div className="row">
                                { Object.values(JSON.parse(localStorage.getItem('interfaces'))).map((value) => (
                                    <ErrorBoundary>
                                      <InterfaceCard key={value.interface} value={value.data} arps={value.arps}/>
                                    </ErrorBoundary>
                                ))}
                              </div>
                              </div>
                              <div class="tab-pane show active" id="table" role="tabpanel">
                                <ErrorBoundary>
                                  <InterfaceTable interfaces={JSON.parse(localStorage.getItem('interfaces'))}/>
                                </ErrorBoundary>
                              </div>
				<div class="tab-pane " id="qos" role="tabpanel">
                                <div className="row">
                                { Object.values(JSON.parse(localStorage.getItem('qos'))).map(value => 
                                  <div>
                                  <ErrorBoundary> <Qos value={value}/></ErrorBoundary>
                                  </div>
                       
                                )}
                              </div>
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
                    <div className="col-xl-4">
                      <ErrorBoundary>
                        <Envirmoment env={JSON.parse(localStorage.getItem('env'))}/>
                      </ErrorBoundary>
                    </div>
                    <div className="col-xl-8">
                          <ErrorBoundary>
                            <CpuUsage cpu={JSON.parse(localStorage.getItem('cpu'))} mem={JSON.parse(localStorage.getItem('mem'))}/>
                          </ErrorBoundary>
                      </div>
               </div>
              </div>
    }
else if (update < 2){
  return  <div>
            <h4 class="text-center fade-in" style={{marginTop: 100}}>Collecting Data</h4>
            <div class="loader text-center"></div>
        </div>
}

  }
    
  
  