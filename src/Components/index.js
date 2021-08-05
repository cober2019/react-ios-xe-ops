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
  var [updateSomeChildren, setupdateSomeChildren] = useState(0)


  const setAuthTrue = async (ip, username, password, port) => {
    setIp(ip)
    setUserName(username)
    setPassword(password)
    setPort(port)
    while (true){
      var update = updateSomeChildren += 1
      setupdateSomeChildren(update)
      let interfaces = await PollInterfaces(ip, username, password, port)
      let cpu = await GetCpuStatus(ip, username, password, port)
      console.log(cpu.data.data)
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
                    <ErrorBoundary>
                      <InterfaceCard key={value.interface} value={value.data} arps={value.arps} ip={ip} port={port} username={username} password={password}/>
                    </ErrorBoundary>
                  ))}
              </div>
            </div>
  }

  }
    
  
  