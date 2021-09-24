import './App.css';
import { Index }  from './Components/Index/index'
import { LayerTwo }  from './Components/LayerTwo/layerTwo'
import { Environment }  from './Components/Environment/env'
import { Routing }  from './Components/LayerThree/routing'
import { Dmvpn }  from './Components/DMVPN/dmvpn'
import { RestConfig }  from './Components/Config/config'
import { RibIndex }  from './Components/RibStatus/RibMain'
import { IpSlas }  from './Components/IPSlas/SlaParent'
import { DeviceAuth }  from './Components/Other/login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'
import { RibInfo } from './Components/RibStatus/getRibs';
const queryClient = new QueryClient()

function App() {

  const setAuthTrue = async (ip, username, password, port, token) => {
    console.log(localStorage.getItem('ip'))
    if(localStorage.getItem('ip') === null){
      localStorage.setItem('ip', ip);
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('port', port);
      localStorage.setItem('token', token);
      }
    }

  return (
    <div classname="App">
      <Router>
        <Switch>
          <Route path="/logout" render={props => (<DeviceAuth callback={setAuthTrue} {...props}/>)}/>

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


          <Route path="/" render={props => (<DeviceAuth callback={setAuthTrue} {...props}/>)}/>
        </Switch>
    </Router>
    </div>

  );
}

export default App;