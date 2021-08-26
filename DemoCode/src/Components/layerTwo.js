import React, { useState, useEffect } from 'react';
import { PollL2Page, ApiCheck } from './promises'
import { VlansData, TrunkData, AccessData, DpData } from './errorData'
import { DpNeighbors} from './dp_neighbors'
import { Trunks} from './trunks'
import { AccessPorts} from './accessPorts'
import { Vlans} from './vlans'
import { Navbar } from './navbar';
import { ErrorBoundary } from './errorBoundry';

export  function LayerTwo(props){
  const [update, setUpdate] = useState(0)

  useEffect(() => {
    (async () => {
      try{
        let indexData = await PollL2Page(localStorage.getItem('ip'), localStorage.getItem('username'), localStorage.getItem('password'), localStorage.getItem('port'))
        //localStorage.setItem('trunks', JSON.stringify(indexData.data.trunks));
        //localStorage.setItem('access', JSON.stringify(indexData.data.access));
        //localStorage.setItem('dpNeighbors', JSON.stringify(indexData.data.dpNeighbors));
        //localStorage.setItem('vlans', JSON.stringify(indexData.data.vlans));
	//ApiCheck()
        localStorage.setItem('vlans', JSON.stringify(VlansData));
        localStorage.setItem('trunks', JSON.stringify(TrunkData()));
        localStorage.setItem('access', JSON.stringify(AccessData()));
        localStorage.setItem('dpNeighbors', JSON.stringify(DpData));
	console.log(localStorage.getItem('trunks'))
        let render = update + 1
        setUpdate(render)
      }
      catch{
        localStorage.setItem('trunks', JSON.stringify(TrunkData));
        localStorage.setItem('access', JSON.stringify(AccessData));
        localStorage.setItem('dpNeighbors', JSON.stringify(DpData));
        localStorage.setItem('vlans', JSON.stringify(VlansData));
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



if (update >= 2){
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
              <div className="col-xl-6">
                <div className="row">
                  <ErrorBoundary>
                    <Trunks ports={JSON.parse(localStorage.getItem('trunks'))}/>
                  </ErrorBoundary>
                </div>
                <div className='row'>
                  <ErrorBoundary>
                    <AccessPorts ports={JSON.parse(localStorage.getItem('access'))}/>
                  </ErrorBoundary>
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
    
  
  