import React, { useState, useEffect } from 'react';
import { ApiCheck } from './promises'
import { Link } from "react-router-dom";

export  function Navbar(props){
  const [apiStatus, setApiStatus] = useState(true)

  useEffect(() => {
    (async () => {
      try{
        let apiStatus = await ApiCheck()
        if(apiStatus.status === 200)
            setApiStatus(true)
        else{
            setApiStatus(false)
        }
    }
    catch{
        setApiStatus(false)
    }

    })()
    }, [props.update])

  return  <div>
            <nav class="navbar navbar-expand-lg navbar-light" style={{backgroundColor: "black"}}>
                <div class="container-fluid">
                    <a class="navbar-brand"  style={{color: 'white'}}>Bandwidth Monitor | </a>
                    <div>
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <Link className="nav-items" style={{paddingLeft:15 , paddingRight: 15, fontSize: 20, color: "white", textDecoration: 'none'}} to="/index">Home</Link>
                            </li>
                            <li class="nav-item">
                            <Link className="nav-items" style={{fontSize: 20, paddingRight: 1375, color: "white", textDecoration: 'none'}} to="/layerTwo">LayerTwo</Link>
                                </li>
                            <li class="nav-item">
                                <Link style={{fontSize: 18, color: "white", textDecoration: 'none'}} className="nav-items" to='/logout'>| Logout({props.ip})</Link>
                            </li>
                        </ul>            
                    </div>
                    {apiStatus ? <div class="fa fa-circle env-row-text nav-items"><span style={{fontWeight: 'normal', paddingLeft: 5}}>API Reachable</span></div> 
                        :  
                        <div class="fa fa-circle env-row-text-warn nav-items"><span style={{fontWeight: 'normal', paddingLeft: 5}}>API Unreachable</span></div>}
                </div>
            </nav>                      
            </div>
  }
  