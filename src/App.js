import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Index }  from './Components/Index/Index-Parent.js';
import { LayerTwo }  from './Components/LayerTwo/layerTwo-Parent.js';
import { Environment }  from './Components/Environment/Env-Parent.js';
import { Routing }  from './Components/LayerThree/Routing-Parent.js';
import { Dmvpn }  from './Components/DMVPN/Dmvpn-Parent.js';
import { RestConfig }  from './Components/Config/config.js';
import { RibIndex }  from './Components/RibStatus/RIB-Parent.js';
import { DeviceAuth }  from './Components/Other/login.js';
import { IpSlas }  from './Components/IPSlas/SlaParent.js';
import { LiveInterfaces }  from './Components/InterfaceGraphs/liveInterface.js';
import { RecoilRoot, atom } from 'recoil';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';

export const encytpKey = atom({
  key: 'key',
  default: 'jdh%):Aap(3>S#', 
});


const queryClient = new QueryClient();

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>


          <Route path="/index">
          <RecoilRoot>
            <QueryClientProvider client={queryClient}>
              <Index/>
            </QueryClientProvider>
          </RecoilRoot>
          </Route>

          <Route path="/layerTwo">
            <RecoilRoot>
              <QueryClientProvider client={queryClient}>
                <LayerTwo/>
              </QueryClientProvider>
            </RecoilRoot>
          </Route>

          <Route path="/routing">
            <RecoilRoot>
              <QueryClientProvider client={queryClient}>
              <Routing/>
              </QueryClientProvider>
            </RecoilRoot>
          </Route>


          <Route path="/config">
            <RecoilRoot>
              <QueryClientProvider client={queryClient}>
                <RestConfig/>
              </QueryClientProvider>
            </RecoilRoot>
          </Route>  


          <Route path="/dmvpn">
            <RecoilRoot>
              <QueryClientProvider client={queryClient}>
                <Dmvpn/>
              </QueryClientProvider>
            </RecoilRoot>
          </Route>  


          <Route path="/environment">
            <RecoilRoot>
              <QueryClientProvider client={queryClient}>
                <Environment/>
              </QueryClientProvider>
            </RecoilRoot>
          </Route>

          <Route path="/ribstatus">
            <RecoilRoot>
              <QueryClientProvider client={queryClient}>
                <RibIndex/>
              </QueryClientProvider>
            </RecoilRoot>
          </Route>

	        <Route path="/ipslas">
            <RecoilRoot>
              <QueryClientProvider client={queryClient}>
                <IpSlas/>
              </QueryClientProvider>
            </RecoilRoot>
          </Route>

          <Route path="/live_interfaces">
          <RecoilRoot>
              <QueryClientProvider client={queryClient}>
                <LiveInterfaces/>
              </QueryClientProvider>
            </RecoilRoot>
          </Route>



          <Route path="/">
          <RecoilRoot>
              <QueryClientProvider client={queryClient}>
                <DeviceAuth/>
              </QueryClientProvider>
            </RecoilRoot>
	        </Route>

	        <Route path="/logout">
            <RecoilRoot>
              <QueryClientProvider client={queryClient}>
                <DeviceAuth/>
              </QueryClientProvider>
            </RecoilRoot>
	        </Route>

        </Switch>
    </Router>
    </div>

  );
}

export default App;