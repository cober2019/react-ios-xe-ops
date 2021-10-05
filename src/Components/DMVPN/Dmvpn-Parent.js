import React from 'react';
import axios from 'axios';
import {AES, enc} from 'crypto-js';
import {useRecoilState} from 'recoil';
import { Ospf } from '../LayerThree/ospf';
import { Navigation } from '../Other/navbar';
import { DmvpnData } from './dmvpnData';
import { useQuery } from 'react-query';
import { ErrorBoundary } from '../Other/errorBoundry';
import { encytpKey } from '../../index';

export  function Dmvpn(){
    const [decrypt, setDecrypt] = useRecoilState(encytpKey);
    const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
    const { isLoading, error, data, isFetching } = useQuery('getDmvpn', async () => {

        const response = await axios.post('/getDmvpn',{'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
        'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')})
        console.log(response.data)

        return response.data

        },
        {
        refetchInterval: 20000, cacheTime: 0
        }
  )


  if (error){
    return  <div>
                <Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
                <h4 class="text-center fade-in" style={{marginTop: 100}}>Error Collecting Data. I'll Keep Trying</h4>
                <div class="warning-loader text-center"></div>
            </div>
}
else if (data){
    return <div className="container-fluid">
                <Navigation update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
                    <div className="row mt-3">
                        <div className="col-12">
                        <ErrorBoundary>
                            <DmvpnData dmvpn={data.dmvpn} dmvpnInts={data.dmvpnInts} hubs={data.hubs} locations={data.location} routing={data.routing} localIp={localStorage.getItem('ip')}/>
                        </ErrorBoundary>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12">
                        <ErrorBoundary>
                            {data.ospf.length > 0 ? <Ospf neighbors={data.ospf} interfaces={data.ospfInts} topology={data.ospfTopology}/> : <div/>}
                        </ErrorBoundary>
                        </div>
                    </div>
                </div>
}
else if (isLoading){
    return  <div>
                <h4 class="text-center fade-in" style={{marginTop: 100}}>Collecting DMVPN Toplogy Data From {localStorage.getItem('ip')}</h4>
                <div class="loader text-center"></div>
            </div>
}


}
    
  
  
