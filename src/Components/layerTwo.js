import React, { useState } from 'react';
import { GetLayerTwoInterfaces, GetVlans} from './promises'
import { Trunks} from './trunks'
import { AccessPorts} from './accessPorts'
import { Vlans} from './vlans'
import { DeviceAuth} from './login'
import { ErrorBoundary } from './errorBoundry';


export  function LayerTwo(props){
  const [isAuth, setIsAuth] = useState(false)
  const [interfaces, setInterfaces] = useState([])
  const [vlans, setVlans] = useState([])
  const [trunks, setTrunks] = useState([])
  const [access, setAccess] = useState([])


  const setAuthTrue = async (ip, username, password, port) => {

    try{
      var vlans = await GetVlans(ip, username, password, port)
      setVlans(vlans.data.data)
    }
    catch(e){
      console.log(e)
    }

    while (true){

      try{
        var layerTwoInts = await GetLayerTwoInterfaces(ip, username, password, port)
        console.log(layerTwoInts.data.access)
        setTrunks(layerTwoInts.data.trunks)
        setAccess(layerTwoInts.data.access)
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
                <ErrorBoundary>
                  <Vlans vlans={vlans}/>
                </ErrorBoundary>
                <div className="col-xl-6">
                  <div className="row">
                    <ErrorBoundary>
                      <Trunks ports={trunks}/>
                    </ErrorBoundary>
                  </div>
                  <div className='row'>
                    <ErrorBoundary>
                      <AccessPorts ports={access}/>
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>
  }

  }
    
  
  