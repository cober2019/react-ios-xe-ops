import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import {useRecoilState} from 'recoil';
import { Login } from './promises'
import { AES }from 'crypto-js';
import { encytpKey } from '../../index'


export function DeviceAuth(props){
    const [encrypt, setDecrypt] = useRecoilState(encytpKey);
    const [loading, setloading] = useState(false);
    const [ip, setIp] = useState(null)
    const [username, setUserNaMe] = useState(null)
    const [password, setPassword] = useState(null)
    const [port, setPort] = useState(443)
    const [isAuth, setAuth] = useState(false)    


    const handleSubmit = async (evt) => {
        evt.preventDefault();
        localStorage.clear();
        try{
            let response = await Login(ip, username, password)
            if(response.data.status === 200){
                const encryptPassword = AES.encrypt(password, encrypt);
                localStorage.setItem('ip', ip);
                localStorage.setItem('port', 443);
                localStorage.setItem('username', username);
                localStorage.setItem('password', encryptPassword.toString());
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
            <div className="container-fluid  center-login">
                <div className="col-12">
                    <div className="card">
                        <div className='card-body'>
                        <h3 class="card-title mb-3" style={{textAlign: 'center', color: 'black'}}>IOS-XE Login</h3>
                        <br/>
                        {loading ? <div className="overlay" onclick="off()" style={{display: "flex", justifyContent: "center"}}><div className='row'><p></p><div class="spinner"></div></div></div>: <div/>}
                        <form onSubmit={handleSubmit}>
                            <input  type="text" class="form-control input-text" value={ip} onChange={e => setIp(e.target.value)} placeholder="IP Address" name="ipAddress" required/>
                            <br/>
                                <input type="text" class="form-control input-text" value={username} onChange={e => setUserNaMe(e.target.value)} placeholder="Username" name="username" required/>
                            <br/>
                                <input  type="text" class="form-control input-text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" name="password" required/>
                            <br/>
                                <input  type="text" class="form-control input-text" value={port} onChange={e => setPort(e.target.value)} placeholder="Default 443" name="restconfPort" />
                            <br/>
                            <input  onClick={() => setloading(true)} style={{marginTop: '30px', marginBottom: '30px'}} type="submit" value="Login" className="btn btn-primary"/>
                            <br/>
                        </form>
                        </div>
                    </div>
                </div>
                </div>
            );
        }
        else if(isAuth){
            return(
            <Redirect push to={{pathname: '/index'}} from='/login'/>
            )
        }
    }