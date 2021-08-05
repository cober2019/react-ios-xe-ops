import './App.css';
import { Index }  from './Components/index'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";


function App() {
  return (
      <Router>
        <div classname="App">
        <Redirect to='/index' />
        </div>
        <Switch>
          <Route exact path="/index" component={Index}/>
        </Switch>
    </Router>
  );
}

export default App;