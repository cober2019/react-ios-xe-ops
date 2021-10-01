
import { Navbar } from '../Other/navbar'
import { RibInfo} from './getRibs'
import { RibDiff} from './ribDiff'
import { ErrorBoundary } from '../Other/errorBoundry';
import { RoutingProtocols} from './protocols'
import axios from 'axios';
import { useQuery } from 'react-query';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export function RibIndex(){
    
    const { isLoading, error, data, isFetching  } = useQuery('ribStatus', async () => {
      
        const response = await axios.post('/ribStatus',{'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
        'password': localStorage.getItem('password'), 'port': localStorage.getItem('port')}, {'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        console.log(response)
        return response.data

        },
        {
        refetchInterval: 5000, cacheTime: 0
        }
  )
  console.log(isFetching)
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
                    <ErrorBoundary>
                        <RibInfo routes={data.ribsEntries}/>
                    </ErrorBoundary>
                    <div className="row">
                    <ErrorBoundary>
                        <RoutingProtocols protocols={data.protocols}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <RibDiff ribs={data.flaps.routes}/>
                    </ErrorBoundary>
                    </div>
                        
                    </div>
    }
    else if (isLoading){
        return  <div>
                    <h4 class="text-center fade-in" style={{marginTop: 100}}>Collecting rib data for {localStorage.getItem('ip')}</h4>
                    <div class="loader text-center"></div>
                </div>
    }

    }



      
