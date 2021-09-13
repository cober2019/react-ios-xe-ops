import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Ospf } from './ospf';
import { Bgp } from './bgp';
import { Navbar } from '../Other/navbar';
import { ErrorBoundary } from '../Other/errorBoundry';

export  function Routing(props){
  const [update, setUpdate] = useState(0)
  const errorRef = useRef(false)

  useEffect(() => {

    const source = axios.CancelToken.source()

    if(update !== 0){

      axios.post('/pollRouting', 
      
        {cancelToken: source.token, 
        'ip': localStorage.getItem('ip'), 
        'username': localStorage.getItem('username'), 
        'password': localStorage.getItem('password'), 
        'port': localStorage.getItem('port')},
        {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(data => {
        console.log(data)
        localStorage.setItem('ospf', JSON.stringify(data.data.ospf));
        localStorage.setItem('ospfInts', JSON.stringify(data.data['ospf_ints']));
        localStorage.setItem('bgp', JSON.stringify(data.data.bgp));
        localStorage.setItem('bgpDetails', JSON.stringify(data.data.bgpDetails));
        localStorage.setItem('bgpTopology', JSON.stringify(data.data.bgpToplogy));

        errorRef.current = false
        let render = update + 1
        setUpdate(render)

      }).catch(error => {
          console.log(error)
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
                    <h4 class="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
                    <div class="warning-loader text-center"></div>
                </div>
}
else if (update >= 2 && !errorRef.current){
        return <div className="container-fluid">
                    <Navbar update={update} ip={localStorage.getItem('ip')}/>
                        <div className="row mt-3 mb-3">
                            <div className="col-12">
                                    <Bgp neighbors={JSON.parse(localStorage.getItem('bgp'))} details={JSON.parse(localStorage.getItem('bgpDetails'))} topology={JSON.parse(localStorage.getItem('bgpTopology'))}/>
                            </div>
                        </div>
                        <div className="row mt-3 mb-3">
                            <div className="col-12">
                                <Ospf neighbors={JSON.parse(localStorage.getItem('ospf'))} interfaces={JSON.parse(localStorage.getItem('ospfInts'))}/>
                            </div>
                        </div>
                    </div>
}
else if (update < 2){
        return  <div>
                    <h4 class="text-center fade-in" style={{marginTop: 100}}>Collecting routing data for {localStorage.getItem('ip')}</h4>
                    <div class="loader text-center"></div>
                </div>
}

}
    
  
  