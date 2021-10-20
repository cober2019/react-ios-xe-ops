import React, {useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { CpuUsage} from './cpuUsages'
import { Sensors} from './sensors'
import { ErrorBoundary } from '../Other/errorBoundry';
import { EnvData} from '../Other/data';
import { Navbar } from '../Other/navbar';
import { Poe , Transiever } from '../Other/data';
import { PoeConnections } from './poe'
import { Transceivers } from './transceivers'
import {AES, enc}from 'crypto-js';



export function Environment(props){
  const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), 'MYKEY4DEMO');
  const password = passwordDecrypt.toString(enc.Utf8);
  const { isLoading, error, data, isFetching } = useQuery('pollEnv', async () => {
    
        const response = await axios.post('/pollEnv', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
                'password': password, 'port': localStorage.getItem('port')})
                return response.data
  
                },
                {
                  refetchInterval: 10000, cacheTime: 0
                }
    )


    if (error){
      return  <div>
                <Navbar update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
                <h4 classname="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
                <div classname="warning-loader text-center"></div>
              </div>
    }
    else if (data){
          return  <div className="container-fluid">
                      <Navbar update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
                      <ErrorBoundary>
                          <Transceivers transceivers={data.transceivers}/>
                      </ErrorBoundary>
                      <div className="row">
                          <div className="col-xl-4">
                            <ErrorBoundary>
                              <Sensors env={data.env}/>
                            </ErrorBoundary>
                            <ErrorBoundary>
                              <PoeConnections poe={data.poe}/>
                          </ErrorBoundary>
                          </div>
    
                        <div className="col-xl-8">
                              <ErrorBoundary>
                                <CpuUsage cpu={data.cpu} mem={data.mem}/>
                              </ErrorBoundary>
                        </div>
                      </div>
                  </div>
        }
    else if (isLoading){
      return  <div>
                <h4 classname="text-center fade-in" style={{marginTop: 100}}>Collecting Data for {localStorage.getItem('ip')}</h4>
                <div classname="loader text-center"></div>
            </div>
    }
    


  }
    
  
  
