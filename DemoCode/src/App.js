import './App.css';
import { Index }  from './Components/index'
import { LayerTwo }  from './Components/layerTwo'
import { DeviceAuth }  from './Components/login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";


function App() {

  const setAuthTrue = async (ip, username, password, port) => {
    console.log(localStorage.getItem('ip'))
    if(localStorage.getItem('ip') === null){
      localStorage.setItem('ip', ip);
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('port', port);
      }
    }

  return (
    <div classname="App">
      <Router>
        <Switch>
          <Route path="/layerTwo" render={props => (<LayerTwo username={localStorage.getItem('username')} 
                                                  password={localStorage.getItem('password')} 
                                                  ip={localStorage.getItem('ip')} 
                                                  port={localStorage.getItem('port')} 
                                                  />)}/>

          <Route path="/" render={props => (<Index username={'developer'} 
                                                  password={'C1sco12345'} 
                                                  ip={'sandbox-iosxe-latest-1.cisco.com'} 
                                                  port={443} 
                                                  />)}/>
         
        </Switch>
    </Router>
    </div>

  );
}

export default App;