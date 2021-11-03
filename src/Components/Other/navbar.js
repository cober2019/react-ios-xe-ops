import React, { useState, useEffect } from 'react';
import { ApiCheck } from './promises'
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Offcanvas from 'react-bootstrap/Offcanvas'
import Row from "react-bootstrap/Row";
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
  
  return <Container fluid>
          <Row xl className="mt-3">
            <Navbar bg={'black'} expand={false} className="mb-3">
            
              <Navbar.Toggle aria-controls="offcanvasNavbar" style={{backgroundColor: 'white'}}/>
              <Navbar.Offcanvas
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                placement="end">
                <Offcanvas.Header style={{ backgroundColor: '#868F80'}} closeButton>
                  <Offcanvas.Title id="offcanvasNavbarLabel" style={{ color: 'black'}}>XE-Ops</Offcanvas.Title>
                </Offcanvas.Header>
                <div className="border-bottom" style={{color: 'black'}}/>
                <Offcanvas.Body style={{backgroundColor: '#868F80'}}>
                  <Nav className="justify-content-end flex-grow-1 pe-3" >
                    <Link style={{color: 'black', fontWeight: 'bold'}} className="nav-link " to="/index">Home</Link>
                      {localStorage.getItem('model') !== 'ASR' &&  localStorage.getItem('model') !== 'CSR' ? <Link className="nav-link text-light" to="/layerTwo">LayerTwo</Link> : <div/>}
                      <Link style={{color: 'black', fontWeight: 'bold'}} className="nav-link " to="/routing">Routing</Link>
                      <Link style={{color: 'black', fontWeight: 'bold'}} className="nav-link " to="/environment">Env</Link>
                      <Link style={{color: 'black', fontWeight: 'bold'}} className="nav-link " to="/dmvpn">DMVPN</Link>
                      <Link style={{color: 'black', fontWeight: 'bold'}} className="nav-link " to='/ipslas'>IP Slas</Link>
                      <Link style={{color: 'black', fontWeight: 'bold'}} className="nav-link " to="/ribstatus">RibStatus</Link>
                      <Link style={{color: 'black', fontWeight: 'bold'}} className="nav-link " to="/live_interfaces">Live-Interfaces</Link>
                      <Link style={{color: 'black', fontWeight: 'bold'}} className="nav-link " to="/config">Cfg/Oper</Link>
                      <Link style={{color: 'black', fontWeight: 'bold'}} className="nav-link " to='/logout'>Logout</Link>
                      <Row className="border-bottom mb-3 mt-3" style={{color: 'black'}}/>
                      <p style={{color: 'black', fontWeight: 'bold'}} className="nav-link  disabledCursor" style={{color: 'black', fontWeight: 'bold'}}>Connection: {props.ip}</p>
                      {apiStatus ? <p style={{color: 'black', fontWeight: 'bold'}}>API Reachable: &nbsp;<span><div className="fa fa-circle env-row-text"></div></span></p> 
                      :  
                      <p className="env-row-text-warn" style={{color: 'black', fontWeight: 'bold'}}><span >API Unreachable</span></p>}
                      {props.fetchingStatus ? <p style={{color: 'black', fontWeight: 'bold'}}>Polling Status: &nbsp;&nbsp;<div className="fa fa-circle env-row-text"></div></p>
                      : 
                      <p style={{color: 'black', fontWeight: 'bold'}} >Polling Status: &nbsp;&nbsp;<span><div className="fa fa-circle env-row-text-warn disabledCursor"></div></span></p>
                          }
                      <p style={{color: 'black', fontWeight: 'bold'}}>CPU: {props.cpu['Cisco-IOS-XE-process-cpu-oper:cpu-utilization']['five-seconds']}%</p>
                      <p style={{color: 'black', fontWeight: 'bold'}}>Memory: {props.mem['used-percent']}%</p>
                      <p style={{color: 'black', fontWeight: 'bold'}}>Device Model/SN: {localStorage.getItem('model')} ({localStorage.getItem('serial')})</p>
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
              </Navbar>      
            </Row> 
          </Container>
       
  }
  