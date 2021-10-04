import React from 'react';
import axios from 'axios';
import {useRecoilState} from 'recoil';
import { Ospf } from './ospf';
import { Bgp } from './bgp';
import { Navbar } from '../Other/navbar'
import { useQuery } from 'react-query';
import { ErrorBoundary } from '../Other/errorBoundry';
import {AES, enc}from 'crypto-js';
import { encytpKey } from '../../index'

export  function Routing(){
    const [decrypt, setDecrypt] = useRecoilState(encytpKey);
    const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
    const { isLoading, error, data, isFetching } = useQuery('pollRouting', async () => {
    const response = await axios.post('/pollRouting',{'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
    'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')})
    
    return response.data

    },
    {
    refetchInterval: 5000, cacheTime: 0,
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
                    <div className="row mb-3 mt-3">
                        <div className="col-12">
                        <ErrorBoundary>
                            {data.bgpDetails.length > 0 ? <Bgp neighbors={data.bgp} details={data.bgpDetails} topology={data.bgpToplogy}/> : <div/>}
                        </ErrorBoundary>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12">
                        <ErrorBoundary>
                            {data.ospf.length > 0 ? <Ospf neighbors={data.ospf} interfaces={data.ospfInts} topology={data.ospfToplogy}/> : <div/>}
                        </ErrorBoundary>
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
    
  
  