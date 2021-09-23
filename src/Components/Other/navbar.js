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

  return  <nav class="navbar navbar-expand-lg navbar-light" style={{backgroundColor: "black"}}>
                <div class="container-fluid">
                    <div>
                        <ul class="navbar-nav">
                            <li class="nav-item active">
                                <a class="navbar-brand"  style={{color: 'white'}}>Bandwidth Monitor | </a>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-items" style={{paddingLeft:15 , paddingRight: 15, fontSize: 20, color: "white", textDecoration: 'none'}} to="/index">Home</Link>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-items" style={{fontSize: 20, color: "white", textDecoration: 'none'}} to="/layerTwo">LayerTwo</Link>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-items" style={{paddingLeft:20, fontSize: 20 , color: "white", textDecoration: 'none'}} to="/routing">Routing</Link>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-items" style={{paddingLeft:15, fontSize: 20, color: "white", textDecoration: 'none'}} to="/environment">Env</Link>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-items" style={{paddingLeft:15, fontSize: 20, color: "white", textDecoration: 'none'}} to="/dmvpn">DMVPN</Link>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-items" style={{paddingLeft:15, fontSize: 20, color: "white", textDecoration: 'none'}} to="/ribstatus">RibStatus</Link>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-items" style={{paddingLeft:15, fontSize: 20, paddingRight: 900, color: "white", textDecoration: 'none'}} to="/config">Cfg/Oper Browser</Link>
                            </li>
                            <li class="nav-item">
                                <Link style={{fontSize: 18, color: "white", textDecoration: 'none'}} className="nav-items" to='/logout'>Logout</Link>
                            </li>
                            
                        </ul>
                        <div className="row" style={{justifyContent: 'center'}}>
                            <div className="col-6">
                                <div className="card  text-white bg-dark mt-3">
                                    <div className="card-body">
                                    <div className="row" style={{justifyContent: 'center'}}>
                                        <div className="col-3">
                                            <h5 style={{fontSize: '18px'}}>Conn: {props.ip}&nbsp;&nbsp;| </h5>
                                        </div>
                                        <div className="col-3">
                                        {apiStatus ? <h5 style={{fontSize: '18px'}}>API Reachable: &nbsp;<span><div class="fa fa-circle env-row-text"></div></span></h5> 
                                            :  
                                            <div class="fa fa-circle env-row-text-warn"><span style={{fontWeight: 'normal', paddingLeft: 5}}>API Unreachable</span></div>}
                                        </div>
                                        <div className="col-3">
                                        {props.fetchingStatus ? <h5 style={{fontSize: '18px'}}>Polling Status: &nbsp;&nbsp;<div className="fa fa-circle env-row-text "></div></h5>: 
                                        <h5 style={{justifyContent: "right", fontSize: '18px'}}>Polling Status: &nbsp;&nbsp;<span><div className="fa fa-circle env-row-text-warn"></div></span></h5>
                                        }
                                        </div>
                                        </div>
                                        </div>  
                                    </div>                    
                                </div>
                            </div>            
                        </div>
                    </div>
                </nav>
  }
  