import React, { useEffect } from 'react';
import axios from 'axios';
import { Ospf } from './ospf';
import { Bgp } from './bgp';
import { Navbar } from '../Other/navbar'
import { useQuery } from 'react-query';
import { ErrorBoundary } from '../Other/errorBoundry';

export  function Routing(){

  const { isLoading, error, data, isFetching } = useQuery('pollRouting', async () => {
      
        const response = await axios.post('/pollRouting',{'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
        'password': localStorage.getItem('password'), 'port': localStorage.getItem('port')}, {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}})

        return response.data

        },
        {
        refetchInterval: 5000,
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
                        <div className="row mb-3">
                            <div className="col-12">
                                  <Bgp neighbors={data.bgp} details={data.bgpDetails} topology={data.bgpToplogy}/>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-12">
                                <Ospf neighbors={data.ospf} interfaces={data.ospfInts} topology={data.ospfToplogy}/>
                            </div>
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
    
  
  