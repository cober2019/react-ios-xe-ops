import React, { useState } from 'react';
import { PollInterfaces, GetCpuStatus, GetEnvStatus, GetDpNeighbors} from './promises'
import { InterfaceCard} from './interfaceCard'
import { CpuUsage} from './cpuUsages'
import { Envirmoment} from './enviroment'
import { DpNeighbors} from './dp_neighbors'
import { DeviceAuth} from './login'
import { ErrorBoundary } from './errorBoundry';


export  function Index(props){
  const [interfaces, setInterfaces] = useState([])
  const [cpuMemStats, setcpuMemStats] = useState([])
  const [envStats, setEnvStats] = useState([])
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
        setInterfaces(interfaces.data.data)

      }
      catch(e){
        console.log(e)
      }
      try{

        var dp_neighbors = await GetDpNeighbors(ip, username, password, port)
        setDpNeighborS(dp_neighbors.data.data)
        console.log(dp_neighbors)
      }
      catch(e){
        console.log(e)
      }
      
      try{
        var cpu = await GetCpuStatus(ip, username, password, port)
        console.log(cpu)
        setcpuMemStats(cpu)
      }
      catch(e){
        console.log(e)
      }

      try{
        var env = await GetEnvStatus(ip, username, password, port)
        setEnvStats(env.data.data)
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
      <div className="row">
        <div className="col-xl-3">
          <ErrorBoundary>
            <Envirmoment env={envStats}/>
          </ErrorBoundary>
        </div>
        <div className="col-xl-9">
          <div className="row">
              <ErrorBoundary>
                <CpuUsage cpuMem={cpuMemStats.data}/>
              </ErrorBoundary>
          </div>
          <div className="row">
              <ErrorBoundary>
                <DpNeighbors dpNeighbors={dpNeighbors}/>
              </ErrorBoundary>
          </div>
        <div className="row">
            { Object.values(interfaces).map((value) => (
                <ErrorBoundary>
                  <InterfaceCard cpuMem={cpuMemStats.data} key={value.interface} value={value.data} arps={value.arps}/>
                </ErrorBoundary>
            ))}
        </div>
      </div>
    </div>
  </div>
  }

  }
    
  
  