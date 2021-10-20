
import { Navbar } from '../Other/navbar'
import { RibInfo} from './getRibs'
import { RibDiff} from './ribDiff'
import { RoutingProtocols} from './protocols'
import axios from 'axios';
import { useQuery } from 'react-query';
import {AES, enc}from 'crypto-js';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export function RibIndex(){
    const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), 'MYKEY4DEMO');
    const password = passwordDecrypt.toString(enc.Utf8);  
    const { isLoading, error, data, isFetching  } = useQuery('ribStatus', async () => {
      
        const response = await axios.post('/ribStatus',{'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
        'password': password, 'port': localStorage.getItem('port')}, {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        
        return response.data

        },
        {
        refetchInterval: 10000,
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
                        <RibInfo routes={data.ribsEntries}/>
                    <div className="row">
                        <RoutingProtocols protocols={data.protocols}/>
                        <RibDiff ribs={data.flaps.routes}/>
                    </div>
                        
                    </div>
    }
    else if (isLoading){
        return  <div>
                    <h4 classname="text-center fade-in" style={{marginTop: 100}}>Collecting RIB data from {localStorage.getItem('ip')}</h4>
                    <div classname="loader text-center"></div>
                </div>
    }

    }



      
