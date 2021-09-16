import React, { useState, useEffect, useRef } from 'react';
import {  useQuery } from 'react-query'
import axios from 'axios';
import { Arps} from './arps'
import { InterfaceCard} from './interfaceCard'
import { InterfaceTable} from './InterfacesTable'
import { Hsrp} from './hsrp'
import { DpNeighbors} from '../Other/dp_neighbors'
import { ErrorBoundary } from '../Other/errorBoundry';
import { Navbar } from '../Other/navbar';

export function Index(props){

  const { isLoading, error, data } = useQuery('indexData', async () => {
        const data = await axios.post('/pollIndexPage', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
        'password': localStorage.getItem('password'), 'port': localStorage.getItem('port')}, {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}})

        return data.data

        },
        {
          refetchInterval: 5000,
        }
        )

useEffect(() => {
  localStorage.setItem('ip', props.ip);
  localStorage.setItem('username', props.username);
  localStorage.setItem('password', props.password);
  localStorage.setItem('port', props.port);
  localStorage.setItem('token', props.token);
}, [])


if (error){
  return  <div>
            <Navbar update={data} ip={localStorage.getItem('ip')}/>
            <h4 className="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
            <div className="warning-loader text-center"></div>
          </div>
}
else if (data){
  console.log(data)
      return  <div className="container-fluid">
                  <Navbar update={data} ip={localStorage.getItem('ip')}/>
                  <ErrorBoundary>
                    <DpNeighbors dpNeighbors={data.dp}/>
                  </ErrorBoundary>
                  <div className="card border-0 mt-3 mb-3 bg-dark">
                    <div className="card-body">
                      <div className="row">
                        <ul className="nav">
                              <li className="nav-item">
                                  <a href="#table" className="nav-link text-light" data-toggle="tab">Interface Table</a>
                              </li>
                              <li className="nav-item">
                                  <a href="#chart" className="nav-link show active text-light" data-toggle="tab">Interface Chart</a>
                              </li>
                              <li className="nav-item">
                                  <a href="#qos" className="nav-link text-light" data-toggle="tab">Interface Qos</a>
                              </li>
                              <li className="nav-item">
                                  <a href="#arps" className="nav-link text-light" data-toggle="tab">ARPs</a>
                              </li>
                          </ul>
                          <div className="tab-content">
                              <div className="tab-pane " id="chart" role="tabpanel">
                                <div className="row">
                                { Object.values(data.interfaces).map((value) => (
                                    <ErrorBoundary>
                                      <InterfaceCard key={value.name} qos={value.qos} value={value.data} arps={value.arps}/>
                                    </ErrorBoundary>
                                ))}
                              </div>
                              </div>
                              <div className="tab-pane show active" id="table" role="tabpanel">
                                <ErrorBoundary>
                                  <InterfaceTable interfaces={data.interfaces}/>
                                </ErrorBoundary>
                              </div>                        
                              <div className="tab-pane" id="arps" role="tabpanel">
                                <ErrorBoundary>
                                  <Arps arps={data.arps}/>
                                </ErrorBoundary>
                              </div>           
                          </div>
                        </div>
                    </div>
                  </div>
                  <ErrorBoundary>
                    <Hsrp hsrp={data.hsrp} localIp={localStorage.getItem('ip')} />
                  </ErrorBoundary>
                
              </div>
    }
else if (isLoading){
  return  <div>
            <h4 className="text-center fade-in" style={{marginTop: 100}}>Collecting Data for {localStorage.getItem('ip')}</h4>
            <div className="loader text-center"></div>
        </div>
}


  }
    
  
  