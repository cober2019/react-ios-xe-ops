import React from 'react';
import axios from 'axios';
import { Navbar } from '../Other/navbar'
import { SlaStats } from './ipslastats'
import { BuildSlaTopologies } from './slatopologies'
import { useQuery } from 'react-query';
import { ErrorBoundary } from '../Other/errorBoundry';
import {AES, enc}from 'crypto-js';


export  function IpSlas(){
  const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), 'MYKEY4DEMO');
  const password = passwordDecrypt.toString(enc.Utf8);
  const { isLoading, error, data, isFetching } = useQuery('getipsla', async () => {
        const data = await axios.post('/getipsla', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
        'password': password, 'port': localStorage.getItem('port')})

        return data.data

        },
        {
          refetchInterval: 5000, cacheTime: 0
        }
        )

        if (error){
          return  <div>
                      <Navbar update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
                      <h4 class="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
                      <div class="warning-loader text-center"></div>
                  </div>
  }
  else if (data){
          return <div className="container-fluid">
                      <Navbar update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
                          <div className="row mt-3 mb-3">
                              <div className="col-12">
                                  <ErrorBoundary>
                                    <SlaStats slas={data.slas}/>
                                  </ErrorBoundary>
                              </div>
                              { data.slas.map(sla => (
                                  <div className="col-sm">
                                    <ErrorBoundary>
                                      <BuildSlaTopologies sla={sla} localIp={localStorage.getItem('ip')}/>
                                    </ErrorBoundary>
                                </div>
                              ))}
                          </div>
                      </div>
  }
  else if (isLoading){
          return  <div>
                      <h4 class="text-center fade-in" style={{marginTop: 100}}>Collecting routing data for {localStorage.getItem('ip')}</h4>
                      <div class="loader text-center"></div>
                  </div>
  }

}
    
  