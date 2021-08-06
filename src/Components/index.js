import React, { useState } from 'react';
import { PollInterfaces, GetCpuStatus} from './promises'
import { InterfaceCard} from './interfaceCard'
import { CpuUsage} from './cpuUsages'
import { DeviceAuth} from './login'
import { ErrorBoundary } from './errorBoundry';


export  function Index(props){
  const [interfaces, setInterfaces] = useState([])
  const [cpuMemStats, setcpuMemStats] = useState([])
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
        
      }
      catch(e){
        console.log(e)
      }
      
      try{
        var cpu = await GetCpuStatus(ip, username, password, port)
      }
      catch(e){
        console.log(e)
      }
      setInterfaces(interfaces.data.data)
      setcpuMemStats(cpu)
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
              <div className="col-12">
                <ErrorBoundary>
                  <CpuUsage cpuMem={cpuMemStats.data} ip={ip} port={port} username={username} password={password} auth={isAuth}/>
                </ErrorBoundary>
              </div>
            </div>
              <div className="row">
                  { Object.values(interfaces).map((value) => (
                      <div key={value.name} className="col-4">
                      <ErrorBoundary>
                        <InterfaceCard cpuMem={cpuMemStats.data} key={value.interface} value={value.data} arps={value.arps} ip={ip} port={port} username={username} password={password}/>
                      </ErrorBoundary>
                    </div>
                  ))}
              </div>
            </div>
  }

  }
    
  
  
