import React, { useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../Other/navbar'
import { DmvpnData } from './dmvpnData'
import { useQuery } from 'react-query';
import { ErrorBoundary } from '../Other/errorBoundry';

export  function Dmvpn(props){
  const { isLoading, error, data } = useQuery('getDmvpn', async () => {

        const response = await axios.post('/getDmvpn',{'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
        'password': localStorage.getItem('password'), 'port': localStorage.getItem('port')}, {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        console.log(response.data)
        return response.data

        },
        {
        refetchInterval: 20000,
        }
  )

console.log(data)
if (error){
        return  <div>
                    <Navbar update={data} ip={localStorage.getItem('ip')}/>
                    <h4 class="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
                    <div class="warning-loader text-center"></div>
                </div>
}
else if (data){
        return <div className="container-fluid">
                    <Navbar update={data} ip={localStorage.getItem('ip')}/>
                        <div className="row mt-3 mb-3">
                            <div className="col-12">
                                  <DmvpnData dmvpn={data.dmvpn} dmvpnInts={data.dmvpnInts} hubs={data.hubs} locations={data.location} localIp={localStorage.getItem('ip')}/>
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
    
  
  