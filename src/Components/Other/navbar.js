import React, { useState, useEffect } from 'react';
import { ApiCheck } from './promises'
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";

export  function Navigation(props){
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

  return  <div className="row mt-3">
                <Container>
                    <Navbar expand="lg">
                        <Navbar.Brand href="#home" className="disabledCursor">IOS-XE Ops</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto" style={{fontSize: 16}}>
                            <Link className="nav-link text-light" to="/index">Home</Link>
                            <Link className="nav-link text-light"to="/layerTwo">LayerTwo</Link>
                            <Link className="nav-link text-light" to="/routing">Routing</Link>
                            <Link className="nav-link text-light" to="/environment">Env</Link>
                            <Link className="nav-link text-light" to="/dmvpn">DMVPN</Link>
                            <Link className="nav-link text-light" to='/ipslas'>IP Slas</Link>
                            <Link className="nav-link text-light" to="/ribstatus">RibStatus</Link>
                            <Link className="nav-link text-light" to="/config">Cfg/Oper</Link>
                            <Link className="nav-link text-light" to='/logout'>Logout</Link>
                            <Link className="nav-link text-light disabledCursor">&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;Connection: {props.ip}</Link>
                            {apiStatus ? <Link className="nav-link text-light disabledCursor" >API Reachable: &nbsp;<span><div class="fa fa-circle env-row-text"></div></span></Link> 
                            :  
                            <Link class="fa fa-circle env-row-text-warn nav-link text-light disabledCursor"><span >API Unreachable</span></Link>}
                            {props.fetchingStatus ? <Link className="nav-link text-light disabledCursor" >Polling Status: &nbsp;&nbsp;<div className="fa fa-circle env-row-text"></div></Link>: 
                                <Link className="nav-link text-light" >Polling Status: &nbsp;&nbsp;<span><div className="fa fa-circle env-row-text-warn disabledCursor"></div></span></Link>
                                }
                        </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Container>
            </div>
                
  }
  
