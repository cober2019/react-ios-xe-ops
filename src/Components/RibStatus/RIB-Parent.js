import axios from 'axios';
import { useQuery } from 'react-query';
import {AES, enc} from 'crypto-js';
import {useRecoilState} from 'recoil';
import { Navigation } from '../Other/navbar';
import { RibInfo} from './getRibs';
import { RibDiff} from './ribDiff';
import { RoutingProtocols} from './protocols';
import { encytpKey } from '../../index';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export function RibIndex(){
    const [decrypt, setDecrypt] = useRecoilState(encytpKey);
    const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
    const { isLoading, error, data, isFetching  } = useQuery('ribStatus', async () => {
      
        const response = await axios.post('/ribStatus',{'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
        'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')}, {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        
        return response.data

        },
        {
        refetchInterval: 10000, cacheTime: 0,
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
                        <RibInfo routes={data.ribsEntries}/>
                    <div className="row">
                        <RoutingProtocols protocols={data.protocols}/>
                        <RibDiff ribs={data.flaps.routes}/>
                    </div>
                        
                    </div>
    }
    else if (isLoading){
        return  <div>
                    <h4 class="text-center fade-in" style={{marginTop: 100}}>Collecting RIB Data From {localStorage.getItem('ip')}</h4>
                    <div class="loader text-center"></div>
                </div>
    }

    }



      
