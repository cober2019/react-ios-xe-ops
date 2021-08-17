import './App.css';
import { Index }  from './Components/index'
import { LayerTwo }  from './Components/layerTwo'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";


function App() {
  return (
    <div classname="App">
      <Router>
        <Switch>
          <Route exact path="/layerTwo" component={LayerTwo}/>
          <Route exact path="/index" component={Index}/>
          <Route exact path="/" component={Index}/>
        </Switch>
    </Router>
    </div>

  );
}

export default App;