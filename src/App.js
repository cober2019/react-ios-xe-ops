import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Index }  from './Components/Index/Index-Parent';
import { LayerTwo }  from './Components/LayerTwo/layerTwo-Parent';
import { Environment }  from './Components/Environment/Env-Parent';
import { Routing }  from './Components/LayerThree/Routing-Parent';
import { Dmvpn }  from './Components/DMVPN/Dmvpn-Parent';
import { RestConfig }  from './Components/Config/config';
import { RibIndex }  from './Components/RibStatus/RIB-Parent';
import { DeviceAuth }  from './Components/Other/login';
import { IpSlas }  from './Components/IPSlas/SlaParent';
import { LiveInterfaces }  from './Components/InterfaceGraphs/liveInterface';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {



  return (
    <div classname="App">
      <Router>
        <Switch>


          <Route path="/index">
            <QueryClientProvider client={queryClient}>
              <Index/>
            </QueryClientProvider>
          </Route>

          <Route path="/layerTwo">
            <QueryClientProvider client={queryClient}>
              <LayerTwo/>
            </QueryClientProvider>
          </Route>

          <Route path="/routing">
            <QueryClientProvider client={queryClient}>
             <Routing/>
            </QueryClientProvider>
          </Route>


          <Route path="/config">
            <QueryClientProvider client={queryClient}>
              <RestConfig/>
            </QueryClientProvider>
          </Route>  


          <Route path="/dmvpn">
            <QueryClientProvider client={queryClient}>
              <Dmvpn/>
            </QueryClientProvider>
          </Route>  


          <Route path="/environment">
            <QueryClientProvider client={queryClient}>
              <Environment/>
            </QueryClientProvider>
          </Route>

          <Route path="/ribstatus">
            <QueryClientProvider client={queryClient}>
              <RibIndex/>
            </QueryClientProvider>
          </Route>

	        <Route path="/ipslas">
              <QueryClientProvider client={queryClient}>
                <IpSlas/>
              </QueryClientProvider>
          </Route>

          <Route path="/live_interfaces">
              <QueryClientProvider client={queryClient}>
                <LiveInterfaces/>
              </QueryClientProvider>
          </Route>



          <Route path="/">
            <QueryClientProvider client={queryClient}>
              <DeviceAuth/>
            </QueryClientProvider>
	        </Route>

	<Route path="/logout">
            <QueryClientProvider client={queryClient}>
              <DeviceAuth/>
            </QueryClientProvider>
	</Route>

        </Switch>
    </Router>
    </div>

  );
}

export default App;