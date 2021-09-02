import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DpNeighbors} from './dp_neighbors'
import { MacTable} from './macAddress'
import { Trunks} from './trunks'
import { AccessPorts} from './accessPorts'
import { Vlans} from './vlans'
import { Navbar } from './navbar';
import { ErrorBoundary } from './errorBoundry';

export  function LayerTwo(props){
  const [update, setUpdate] = useState(0)
  const errorRef = useRef(false)

  useEffect(() => {

    const source = axios.CancelToken.source()

    if(update !== 0){

      axios.post('/pollL2Page', {cancelToken: source.token, headers: {'Content-Type': 'application/json'}, 'ip': 

      localStorage.getItem('ip'), 
      'username': localStorage.getItem('username'), 
      'password': localStorage.getItem('password'), 
      'port': localStorage.getItem('port')}).then(data => {

        localStorage.setItem('trunks', JSON.stringify(data.data.trunks));
        localStorage.setItem('macs', JSON.stringify(data.data.mac_addresses));
        localStorage.setItem('access', JSON.stringify(data.data.access));
        localStorage.setItem('dpNeighbors', JSON.stringify(data.data.dpNeighbors));
        localStorage.setItem('vlans', JSON.stringify(data.data.vlans));
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
    let render = update + 1
    setUpdate(render)
  }

      
}, [])


if (errorRef.current){
  return  <div>
            <Navbar update={update} ip={localStorage.getItem('ip')}/>
            <h4 class="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data</h4>
        </div>
}
else if (update >= 2 && !errorRef.current){
  return <div className="container-fluid">
          <Navbar ip={localStorage.getItem('ip')}/>
          <div className="row">
            <ErrorBoundary>
              <DpNeighbors dpNeighbors={JSON.parse(localStorage.getItem('dpNeighbors'))}/>
            </ErrorBoundary>
          </div>
          <div className="row">
              <ErrorBoundary>
                <Vlans vlans={JSON.parse(localStorage.getItem('vlans'))}/>
              </ErrorBoundary>
              <div className="col-xl-5">
                <div className="row">
                  <ErrorBoundary>
                    <Trunks ports={JSON.parse(localStorage.getItem('trunks'))}/>
                  </ErrorBoundary>
                </div>
                <div className='row'>
                  <ErrorBoundary>
                    <AccessPorts ports={JSON.parse(localStorage.getItem('access'))}/>
                  </ErrorBoundary>
                  <div className='row'>
                  <ErrorBoundary>
                    <MacTable macs={JSON.parse(localStorage.getItem('macs'))}/>
                  </ErrorBoundary>
                </div>
                </div>
              </div>
            </div>
          </div>
}
else if (update < 2){
  return  <div>
            <h4 class="text-center fade-in" style={{marginTop: 100}}>Collecting L2 Data</h4>
            <div class="loader text-center"></div>
        </div>
}

}
    
  
  