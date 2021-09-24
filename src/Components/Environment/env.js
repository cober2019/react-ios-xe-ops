import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { CpuUsage} from './cpuUsages'
import { Sensors} from './sensors'
import { PoeConnections } from './poe'
import { ErrorBoundary } from '../Other/errorBoundry';
import { Navbar } from '../Other/navbar';

export function Environment(){
  const { isLoading, error, data, isFetching } = useQuery('pollEnv', async () => {
    
        const response = await axios.post('/pollEnv', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
                'password': localStorage.getItem('password'), 'port': localStorage.getItem('port')}, {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}})
                console.log(response)
                return response.data
  
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
      return  <div className="container-fluid">
                  <Navbar update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
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
            <h4 class="text-center fade-in" style={{marginTop: 100}}>Collecting Data for {localStorage.getItem('ip')}</h4>
            <div class="loader text-center"></div>
        </div>
}


  }
    
  
  