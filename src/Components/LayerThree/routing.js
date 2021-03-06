import React, { useEffect } from 'react';
import axios from 'axios';
import { Ospf } from './ospf';
import { Bgp } from './bgp';
import { Navbar } from '../Other/navbar'
import { useQuery, getQueriesData } from 'react-query';
import { ErrorBoundary } from '../Other/errorBoundry';
import {AES, enc}from 'crypto-js';


export  function Routing(props){
    const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), 'MYKEY4DEMO');
    const password = passwordDecrypt.toString(enc.Utf8);
    const { isLoading, error, data, isFetching } = useQuery('pollRouting', async () => {
      
        const response = await axios.post('/pollRouting',{'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
        'password': password, 'port': localStorage.getItem('port')})

        return response.data

        },
        {
        refetchInterval: 5000,
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
    return <div className="container-fluid">
                <Navbar update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
                    <div className="row mb-3 mt-3">
                        <div className="col-12">
                        <ErrorBoundary>
                            <Bgp neighbors={data.bgp} details={data.bgpDetails} topology={data.bgpToplogy}/>
                        </ErrorBoundary>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12">
                        <ErrorBoundary>
                            <Ospf neighbors={data.ospf} interfaces={data.ospfInts} topology={data.ospfToplogy}/>
                        </ErrorBoundary>
                        </div>
                    </div>
                </div>
}
else if (isLoading){
    return  <div>
                <h4 classname="text-center fade-in" style={{marginTop: 100}}>Collecting routing data for {localStorage.getItem('ip')}</h4>
                <div classname="loader text-center"></div>
            </div>
}

}
    
  
  