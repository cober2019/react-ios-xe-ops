import React, { useState, useEffect } from 'react';
import { ApiCheck } from './promises'
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

export  function Navigation(props){
  const [apiStatus, setApiStatus] = useState(true)
  console.log(props)

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

  return  <Row xl className="mt-3">
            <Navbar expand="lg" >
                <Container fluid>
                <Navbar.Brand href="#home" className="disabledCursor">XE Ops</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link className="nav-link text-light" to="/index">Home</Link>
                        <Link className="nav-link text-light" to="/layerTwo">LayerTwo</Link>
                        <Link className="nav-link text-light" to="/routing">Routing</Link>
                        <Link className="nav-link text-light" to="/environment">Env</Link>
                        <Link className="nav-link text-light" to="/dmvpn">DMVPN</Link>
                        <Link className="nav-link text-light" to='/ipslas'>IP Slas</Link>
                        <Link className="nav-link text-light" to="/ribstatus">RibStatus</Link>
                        <Link className="nav-link text-light" to="/live_interfaces">Live-Interfaces</Link>
                        <Link className="nav-link text-light" to="/config">Cfg/Oper</Link>
                        <Link className="nav-link text-light" to='/logout'>Logout</Link>
                        <Link className="nav-link text-light disabledCursor" style={{fontWeight: 'bold'}}>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;Connection: {props.ip}</Link>
                        {apiStatus ? <Link className="nav-link text-light disabledCursor" style={{fontWeight: 'bold'}}>API Reachable: &nbsp;<span><div className="fa fa-circle env-row-text"></div></span></Link> 
                        :  
                        <Link className=" env-row-text-warn nav-link text-light disabledCursor" style={{fontWeight: 'bold'}}><span >API Unreachable</span></Link>}
                        {props.fetchingStatus ? <Link className="nav-link text-light disabledCursor" style={{fontWeight: 'bold'}}>Polling Status: &nbsp;&nbsp;<div className="fa fa-circle env-row-text"></div></Link>: 
                            <Link className="nav-link text-light"style={{fontWeight: 'bold'}} >Polling Status: &nbsp;&nbsp;<span><div className="fa fa-circle env-row-text-warn disabledCursor"></div></span></Link>
                            }
                        <Link className="nav-link text-light disabledCursor" style={{fontWeight: 'bold'}}>CPU: {props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']}%</Link>
                        <Link className="nav-link text-light disabledCursor"  style={{fontWeight: 'bold'}}>Memory: {props.mem['used-percent']}%</Link>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            </Row>
                
  }
  