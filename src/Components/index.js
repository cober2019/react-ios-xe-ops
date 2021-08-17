import React, { useState } from 'react';
import { PollInterfaces, GetCpuStatus, GetEnvStatus, GetDpNeighbors} from './promises'
import { Arps} from './arps'
import { InterfaceCard} from './interfaceCard'
import { InterfaceTable} from './InterfacesTable'
import { CpuUsage} from './cpuUsages'
import { Envirmoment} from './enviroment'
import { DpNeighbors} from './dp_neighbors'
import { DeviceAuth} from './login'
import { ErrorBoundary } from './errorBoundry';
import { Navbar } from './chartConfigs';


export  function Index(props){
  const [interfaces, setInterfaces] = useState([])
  const [cpuMemStats, setcpuMemStats] = useState([])
  const [envStats, setEnvStats] = useState([])
  const [cardView, setcardView] = useState(false)
  const [vlans, setVlans] = useState([])
  const [dpNeighbors, setDpNeighborS] = useState([])
  const [isAuth, setIsAuth] = useState(false)
  const [ip, setIp] = useState(null)
  const [username, setUserName] = useState(null)
  const [password, setPassword] = useState(null)
  const [port, setPort] = useState(443)


  const setAuthTrue = async (ip, username, password, port) => {

    setIp(ip)
    setUserName(username)
    setPassword(password)
    setPort(port)

    while (true){

      try{
        var interfaces = await PollInterfaces(ip, username, password, port)
        if(interfaces === undefined){
          setInterfaces([])
        }
        else{
          setInterfaces(interfaces.data)
        }
      }
      catch(e){
        console.log(e)
      }
      try{

        var dp_neighbors = await GetDpNeighbors(ip, username, password, port)
        if(dp_neighbors === undefined){
          setDpNeighborS([])
        }
        else{
          setDpNeighborS(dp_neighbors.data.data)
        }
      }
      catch(e){
        console.log(e)
      }
      
      try{
        var cpu = await GetCpuStatus(ip, username, password, port)
        if(cpu === undefined){
          setcpuMemStats([])
        }
        else{
          setcpuMemStats(cpu)
        }
      }
      catch(e){
        console.log(e)
      }

      try{
        var env = await GetEnvStatus(ip, username, password, port)
        if(env === undefined){
          setEnvStats([])
        }
        else{
          setEnvStats(env.data.data)
        }
      }
      catch(e){
        console.log(e)
      }
      setIsAuth(true)
    }
  }

  if (isAuth === false){
    return <div>
            <ErrorBoundary>
              <DeviceAuth callback={setAuthTrue}/>
            </ErrorBoundary>
          </div>
  }
  else{
    return <div className="container-fluid">
            <Navbar/>
                <ErrorBoundary>
                  <DpNeighbors dpNeighbors={dpNeighbors}/>
                </ErrorBoundary>
                <div className="card border-0 mt-3 mb-3 bg-dark">
                  <div className="card-body">
                    <div className="row">
                      <ul class="nav">
                            <li class="nav-item">
                                <a href="#table" class="nav-link text-light" data-toggle="tab">Table</a>
                            </li>
                            <li class="nav-item">
                                <a href="#chart" class="nav-link show active text-light" data-toggle="tab">Chart</a>
                            </li>
                            <li class="nav-item">
                                <a href="#arps" class="nav-link show active text-light" data-toggle="tab">ARPs</a>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane " id="chart" role="tabpanel">
                              <div className="row">
                              { Object.values(interfaces.interfaces).map((value) => (
                                  <ErrorBoundary>
                                    <InterfaceCard key={value.interface} value={value.data} arps={value.arps}/>
                                  </ErrorBoundary>
                              ))}
                            </div>
                            </div>
                            <div class="tab-pane show active" id="table" role="tabpanel">
                              <ErrorBoundary>
                                <InterfaceTable interfaces={interfaces.interfaces}/>
                              </ErrorBoundary>
                            </div>
                            <div class="tab-pane show active" id="arps" role="tabpanel">
                              <ErrorBoundary>
                                <Arps arps={interfaces.arps['Cisco-IOS-XE-arp-oper:arp-vrf']}/>
                              </ErrorBoundary>
                            </div>
                        </div>
                      </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-3">
                    <ErrorBoundary>
                      <Envirmoment env={envStats}/>
                    </ErrorBoundary>
                  </div>
                  <div className="col-xl-9">
                        <ErrorBoundary>
                          <CpuUsage cpuMem={cpuMemStats.data}/>
                        </ErrorBoundary>
                    </div>
                  </div>
            </div>
  }

  }
    
  
  