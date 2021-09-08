import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Navbar } from './navbar';

export  function RestConfig(props){
    const [update, setUpdate] = useState(0)
    const [model, updateModel] = useState(undefined)
    const [loading, updateLoading] = useState(false)
    const url = useRef(undefined)
    const errorRef = useRef(false)
    const xpathHistory = useRef([])
    const pythonPath = useRef([])
    const pythonStrPath = useRef('{PythonVar}')
    const leafs = useRef(false)
    const parentKey = useRef(false)
    const config = useRef(false)
    const avaiableUrls = useRef(['Cisco-IOS-XE-arp-oper:arp-data', 'Cisco-IOS-XE-interfaces-oper:interfaces',
                                 'Cisco-IOS-XE-native:native', 'Cisco-IOS-XE-process-cpu-oper:cpu-usage',
                                'Cisco-IOS-XE-platform-software-oper:cisco-platform-software',
                                'Cisco-IOS-XE-environment-oper:environment-sensors', 'openconfig-platform:components',
                                'Cisco-IOS-XE-ospf-oper:ospf-oper-data/ospf-state/ospf-instance', 'Cisco-IOS-XE-matm-oper:matm-oper-data',
                                'Cisco-IOS-XE-spanning-tree-oper:stp-details', 'Cisco-IOS-XE-cdp-oper:cdp-neighbor-details',
                                'Cisco-IOS-XE-lldp-oper:lldp-entries', 'Cisco-IOS-XE-vlan-oper:vlans', , 'Cisco-IOS-XE-bgp-oper:bgp-state-data'])
    
    const previousSelection = async () => {

        if(xpathHistory.current.length !== 0)
            if (xpathHistory.current.length === 1){
                updateLoading(true)

                            axios.post('/query', 

                            { 'ip': localStorage.getItem('ip'), 
                            'username': localStorage.getItem('username'), 
                            'password': localStorage.getItem('password'), 
                            'port': localStorage.getItem('port'), 'url': url.current},
                            {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {

                            pythonStrPath.current = '{PythonVar}'
                            xpathHistory.current.push(url.current);
                            config.current = JSON.parse(response.data.config)
                            parentKey.current = response.data.parent
                            leafs.current = response.data.data

                            url.current= url.current
                            updateLoading(false)

                            }).catch(error => {
                                errorRef.current = true
                                updateLoading(false)
                            });
            }
            else{
                let previousUrl = xpathHistory.current[xpathHistory.current.length - 2];
                updateLoading(true)
                axios.post('/query', 

                            { 'ip': localStorage.getItem('ip'), 
                            'username': localStorage.getItem('username'), 
                            'password': localStorage.getItem('password'), 
                            'port': localStorage.getItem('port'), 'url': previousUrl},
                            {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {

                            pythonStrPath.current = pythonPath.current[pythonPath.current.length - 2];
                            config.current = JSON.parse(response.data.config)
                            parentKey.current = response.data.parent
                            leafs.current = response.data.data
                            xpathHistory.current.pop();
                            pythonPath.current.pop();
                            
                            url.current = previousUrl
                            updateLoading(false)

                            }).catch(error => {
                                errorRef.current = true
                                updateLoading(false)
                            });
            }
    };

    const queryData = uri => {

        if(update !== 0){
          updateLoading(true)
          axios.post('/query', 

            { 'ip': localStorage.getItem('ip'), 
            'username': localStorage.getItem('username'), 
            'password': localStorage.getItem('password'), 
            'port': localStorage.getItem('port'), 'url': uri},
            {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {

            if (response.status === 404){
                //pass
            }
            else if (response.status === 500){
                alert("End of the road")
            }
            else{
                xpathHistory.current.push(uri);
                config.current = JSON.parse(response.data.config)
                parentKey.current = response.data.parent
                leafs.current = response.data.data
                url.current = uri
                updateLoading(false)
            }
            
          }).catch(error => {
              errorRef.current = true
              updateLoading(false)
          });
        }
      }

    const buildUri = nextPath => {

        updateLoading(true)
        const nextUrl = url.current + '/' + nextPath

          axios.post('/query', 

            { 'ip': localStorage.getItem('ip'), 
            'username': localStorage.getItem('username'), 
            'password': localStorage.getItem('password'), 
            'port': localStorage.getItem('port'), 'url': nextUrl}, {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {

            if (response.data.status === 404){

                let index = leafs.current.indexOf(nextPath);
                let urlWithFilter = xpathHistory.current[xpathHistory.current.length - 1] + '=' + encodeURIComponent(nextPath) + '/';

                axios.post('/query', { 'ip': localStorage.getItem('ip'), 
                    'username': localStorage.getItem('username'), 
                    'password': localStorage.getItem('password'), 
                    'port': localStorage.getItem('port'), 'url': urlWithFilter},{'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}}).then(response => {

                    if (response.data === 500 || response.status === 404){
                        alert("No Data Returned")
                    }
                    else{
                        pythonStrPath.current = pythonStrPath.current + '.get(\'' + nextPath + '\')'
                        xpathHistory.current.push(urlWithFilter);
                        pythonPath.current.push(pythonPath.current  + '[' + index + ']');
                        config.current = JSON.parse(response.data.config)
                        parentKey.current = response.data.parent
                        leafs.current = response.data.data
                        url.current = urlWithFilter
                        updateLoading(false)
                    }

            }).catch(error => {
              errorRef.current = true
              updateLoading(false)
          });
            }
            else if (response.data.status === 500 || response.data.status === 404){
                alert("No Data Returned")
            }
            else{
                pythonStrPath.current = pythonStrPath.current + '.get(\'' + nextPath + '\')'
                pythonPath.current.push(pythonStrPath.current);
                xpathHistory.current.push(nextUrl);
                config.current = JSON.parse(response.data.config)
                parentKey.current = response.data.parent
                leafs.current = response.data.data
                url.current = nextUrl
                updateLoading(false)
            }
            
          }).catch(error => {
              errorRef.current = true
              updateLoading(false)
          });
      }

    const handleSubmit = e => {
        e.preventDefault()
        pythonStrPath.current = '{PythonVar}'
        let url = 'https://'+ localStorage.getItem('ip')  + ':' + localStorage.getItem('port') + '/restconf/data/' + model;
        queryData(url)
      }
    
    const handleChange = e => {
        updateModel(e.target.value)
    }

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

    if(url.current !== undefined){

        return  <div className="container-fluid">
                    <Navbar ip={localStorage.getItem('ip')}/>
                    <div className="row">
                        <div className="col-4">
                            <div className="card text-white bg-dark">
                                <div className="card-body">
                                    <div className="row">
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group row">
                                                <h5> Model:</h5>
                                                <div className="col-12">
                                                    <select name="model" value={model} onChange={handleChange}>
                                                        <option >Select...</option>
                                                        {
                                                        avaiableUrls.current.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <input type="submit" value="Submit" className="btn btn-sm btn-primary mt-3"/>
                                        </form> 
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="card text-white bg-dark">
                                <div className="card-body">
                                <div className="row">
                                    <div className="col-3">
                                        <button style={{marginBottom: '15px', fontWeight: 'bold'}} className="btn btn-success btn-md" onClick={(e) => previousSelection(e)}>Previous URI</button>
                                    </div>
                                </div>
                                {loading ? <div className="overlay" onclick="off()" style={{display: "flex", justifyContent: "center"}}><div className='row'><div style={{marginTop: 300}} class="spinner"></div></div></div>: <div/>}
                                <div className="row">
                                    <h5 style={{color: "yellow", fontWeight: 'bold'}}>Current Path: </h5><h5 key={'currentpath'}className="fade-in" >{url.current}</h5>
                                </div>
                                <div className="row">
                                    <h5 style={{color: "yellow", fontWeight: 'bold'}}>Python Path: </h5><h5 key={'currentpath'}className="fade-in" >{pythonStrPath.current}</h5>
                                </div>
                                    <div className='row'>
                                            <div className="col-12">
                                                { leafs.current.map((key, index) => (
                                                    <button key={key + index} style={{marginRight: '3px'}} className="btn btn-success fade-in mb-3" onClick={(e) => buildUri(key, e)}>{key}</button>
                                                ))
                                                }
                                            </div>
                                        </div>
                                    <div className='row'>
                                        <div className="col-12">
                                            <pre  key={'test'} style={{fontWeight:'bold'}}>{JSON.stringify(config.current, null, 2)}</pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    }
      else{
        return <div className="container-fluid">
                    <Navbar ip={localStorage.getItem('ip')}/>
                        <div className="row">
                            <div className="col-4">
                                <div className="card text-white bg-dark">
                                    <div className="card-body">
                                        <div className="row">
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-group row">
                                                    <h5> Model:</h5>
                                                    <div className="col-12">
                                                        <select name="model" value={model} onChange={handleChange}>
                                                            <option >Select...</option>
                                                            {
                                                            avaiableUrls.current.map(option => (
                                                                <option key={option} value={option}>{option}</option>
                                                            ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <input type="submit" value="Submit" className="btn btn-sm btn-primary mt-3"/>
                                            </form> 
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

      }                          
}
        
    
