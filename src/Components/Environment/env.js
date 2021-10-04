import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import {useRecoilState} from 'recoil';
import { CpuUsage} from './cpuUsages'
import { Sensors} from './sensors'
import { ErrorBoundary } from '../Other/errorBoundry';
import { Navbar } from '../Other/navbar';
import { PoeConnections } from './poe'
import { Transceivers } from './transceivers'
import {AES, enc}from 'crypto-js';
import { encytpKey } from '../../index'

export function Environment(){
  const [decrypt, setDecrypt] = useRecoilState(encytpKey);
  const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
  const { isLoading, error, data, isFetching } = useQuery('pollEnv', async () => {
    const response = await axios.post('/pollEnv', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
    'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')})

    return response.data

    },
    {
      refetchInterval: 10000, cacheTime: 0
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
          return  <div className="container-fluid">
                      <Navbar update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
                      <ErrorBoundary>
                          {data.transceivers.length > 0 ? <Transceivers transceivers={data.transceivers}/> : <div/>}
                      </ErrorBoundary>
                      <div className="row">
                          <div className="col-xl-4">
                            <ErrorBoundary>
                              <Sensors env={data.env}/>
                            </ErrorBoundary>
                            <ErrorBoundary>
                              {data.poe.length > 0 ? <PoeConnections poe={data.poe}/> : <div/>}
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
                <h4 class="text-center fade-in" style={{marginTop: 100}}>Collecting Environmental Data From {localStorage.getItem('ip')}</h4>
                <div class="loader text-center"></div>
            </div>
    }
    


  }
    
  
  
