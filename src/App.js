import './App.css';
import { Index }  from './Components/Index/index'
import { LayerTwo }  from './Components/LayerTwo/layerTwo'
import { Environment }  from './Components/Environment/env'
import { Routing }  from './Components/LayerThree/routing'
import { Dmvpn }  from './Components/DMVPN/dmvpn'
import { RestConfig }  from './Components/Config/config'
import { DeviceAuth }  from './Components/Other/login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { QueryClient } from 'react-query'
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

          <Route path="/index" render={props => (<Index username={localStorage.getItem('username')} 
                                                  password={localStorage.getItem('password')} 
                                                  ip={localStorage.getItem('ip')} 
                                                  port={localStorage.getItem('port')}
                                                  token={localStorage.getItem('token')} 
                                                  />)}/>


          <Route path="/layerTwo" render={props => (<LayerTwo username={localStorage.getItem('username')} 
                                                  password={localStorage.getItem('password')} 
                                                  ip={localStorage.getItem('ip')} 
                                                  port={localStorage.getItem('port')}
                                                  token={localStorage.getItem('token')}  
                                                  />)}/>

          <Route path="/routing" render={props => (<Routing username={localStorage.getItem('username')} 
                                                  password={localStorage.getItem('password')} 
                                                  ip={localStorage.getItem('ip')} 
                                                  port={localStorage.getItem('port')}
                                                  token={localStorage.getItem('token')} 
                                                  />)}/>

          <Route path="/config" render={props => (<RestConfig username={localStorage.getItem('username')} 
                                                  password={localStorage.getItem('password')} 
                                                  ip={localStorage.getItem('ip')} 
                                                  port={localStorage.getItem('port')} 
                                                  />)}/>

          <Route path="/dmvpn" render={props => (<Dmvpn username={localStorage.getItem('username')} 
                                                  password={localStorage.getItem('password')} 
                                                  ip={localStorage.getItem('ip')} 
                                                  port={localStorage.getItem('port')}
                                                  token={localStorage.getItem('token')} 
                                                  />)}/>

          <Route path="/environment" render={props => (<Environment username={localStorage.getItem('username')} 
                                                  password={localStorage.getItem('password')} 
                                                  ip={localStorage.getItem('ip')} 
                                                  port={localStorage.getItem('port')}
                                                  token={localStorage.getItem('token')} 
                                                  />)}/>
          <Route path="/" render={props => (<DeviceAuth callback={setAuthTrue} {...props}/>)}/>
        </Switch>
    </Router>
    </div>

  );
}

export default App;