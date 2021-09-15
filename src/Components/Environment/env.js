import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CpuUsage} from './cpuUsages'
import { Sensors} from './sensors'
import { ErrorBoundary } from '../Other/errorBoundry';
import { Navbar } from '../Other/navbar';

export function Environment(props){
  const [update, setUpdate] = useState(0)
  const errorRef = useRef(false)

  useEffect(() => {

    const source = axios.CancelToken.source()

    if(update !== 0){
      
      axios.post('/pollEnv',
      {'ip': localStorage.getItem('ip'), 
      'username': localStorage.getItem('username'), 
      'password': localStorage.getItem('password'), 
      'port': localStorage.getItem('port')},
      {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(data => {
      
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
                  <div className="row">
                    <div className="col-xl-3">
                      <ErrorBoundary>
                        <Sensors env={JSON.parse(localStorage.getItem('env'))}/>
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
    
  
  