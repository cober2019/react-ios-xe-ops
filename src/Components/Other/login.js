import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useRecoilState} from 'recoil';
import { Login } from './promises'
import { AES }from 'crypto-js';
import {encytpKey}  from '../../App'


export function DeviceAuth(props){
    const [encrypt] = useRecoilState(encytpKey);
    const [loading, setloading] = useState(false);
    const [ip, setIp] = useState('')
    const [username, setUserNaMe] = useState('')
    const [password, setPassword] = useState('')
    const [port, setPort] = useState(443)
    const [isAuth, setAuth] = useState(false)
 
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        localStorage.clear();
        try{
            let response = await Login(ip, username, password)
            console.log(response)
            if(response.data.status === 200){
                
                const encryptPassword = AES.encrypt(password, encrypt);
                localStorage.setItem('ip', ip);
                localStorage.setItem('port', 443);
                localStorage.setItem('username', username);
                localStorage.setItem('password', encryptPassword.toString());
                localStorage.setItem('model', response.data.model);
                localStorage.setItem('serial', response.data.serial);
                localStorage.setItem('uptime', response.data.uptime);
                localStorage.setItem('software', response.data.software);
                setAuth(true)
            }
            else{
                alert('Login Failed')
                setloading(false)
            }
        }
        catch(e){
            alert('Login Failed')
            setloading(false)
        } 
    }

    if(!isAuth){
        return (
            <Container fluid="xl">
                <Row style={{alignItems: 'center', marginTop: "100px"}}>
                    <Col xl={4}/>
                    <Col xl={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title style={{color: 'black', textAlign: 'center'}}>IOS-XE Login</Card.Title>
                                <br/>
                                {loading ? <div className="overlay" onclick="off()" style={{display: "flex", justifyContent: "center"}}><div className='row'><p></p><div className="spinner"></div></div></div>: <div/>}
                                <form onSubmit={handleSubmit}>
                                    <input  type="text" className="form-control input-text" value={ip} onChange={e => setIp(e.target.value)} placeholder="IP Address" name="ipAddress" required/>
                                    <br/>
                                        <input type="text" className="form-control input-text" value={username} onChange={e => setUserNaMe(e.target.value)} placeholder="Username" name="username" required/>
                                    <br/>
                                        <input  type="text" className="form-control input-text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" name="password" required/>
                                    <br/>
                                        <input  type="text" className="form-control input-text" value={port} onChange={e => setPort(e.target.value)} placeholder="Default 443" name="restconfPort" />
                                    <br/>
                                    <input  onClick={() => setloading(true)} style={{marginTop: '30px', marginBottom: '30px'}} type="submit" value="Login" className="btn btn-primary"/>
                                    <br/>
                        </form>
                        </Card.Body>
                    </Card>
                    </Col>
                    <Col xl={4}/>
                    </Row>
                </Container>
            );
        }
        else if(isAuth){
            return(
            <Redirect push to={{pathname: '/index'}} from='/login'/>
            )
        }
    }