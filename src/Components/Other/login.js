import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import { useQuery } from 'react-query'
import axios from 'axios';
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form'
import {useRecoilState} from 'recoil';
import { LoginModal } from '../Modals/loadingModal'
import { AES }from 'crypto-js';
import {encytpKey}  from '../../App'
import { error } from 'jquery';

export function DeviceAuth(){
    const [encrypt] = useRecoilState(encytpKey);
    const [ip, setIp] = useState('')
    const [username, setUserNaMe] = useState('')
    const [password, setPassword] = useState('')
    const [port, setPort] = useState(443)
    const [isAuth, setAuth] = useState(false)
    const [modalShow, setModalShow] = React.useState(false);
    const [msg, setMsg] = useState('Autheniticating')
    const requestSession = axios.create();
    requestSession.defaults.timeout = 30000;
    const { isLoading, error, data, isFetching, refetch, isSuccess } = useQuery(ip + 'login', async () => {
    
        await requestSession.post('/login', {'ip': ip, 'username': username, 'password': password, 'port': port}).then(response =>{

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
                setModalShow(false)
                setAuth(true)

                return response.data
    
            }
            else{
                setMsg('Authentication Failed')
            }
        }).catch(() => {setMsg('Request Timeout')})
    

        },
        {
            enabled: false
        })


    const handleSubmit =  (evt) => {
        evt.preventDefault();
        refetch();

    }

    const resetPageStatus = () => {
        setMsg('Autheniticating')
        setModalShow(false)
    }

    useEffect(() => {
        localStorage.clear()
    }, [])
    

    if(!isAuth){
        return (
            <Container fluid="xl">
                <Row style={{alignItems: 'center', marginTop: "100px"}}>
                    <Col xl={4}/>
                    <Col xl={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title className="mb-3" style={{color: 'black', textAlign: 'center'}}>IOS-XE Login</Card.Title>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Control className="mb-3 text-center" value={ip} onChange={e => setIp(e.target.value)} placeholder="IP Address" name="ipAddress" required/>
                                        <Form.Control className="mb-3 text-center" value={username} onChange={e => setUserNaMe(e.target.value)} placeholder="Username" name="username" required/>
                                        <Form.Control className="mb-3 text-center" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" name="password" required/>
                                        <Form.Control className="mb-3 text-center" value={port} onChange={e => setPort(e.target.value)} placeholder="Default 443" name="restconfPort" required/>
                                        <Form.Control  onClick={() => setModalShow(true)} type="submit" value="Login" className="btn btn-success"/>
                                    </Form>
                                    {modalShow ? <LoginModal msg={msg} show={modalShow} onHide={() => resetPageStatus()}/> : <></>}
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
