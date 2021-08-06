import React, { useState } from 'react';
import { Login } from './promises'

export function DeviceAuth(props){
    const [loading, setloading] = useState(false);
    const [ip, setIp] = useState(null)
    const [username, setUserNaMe] = useState(null)
    const [password, setPassword] = useState(null)
    const [port, setPort] = useState(443)    

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        
        try{
            var response = await Login(ip, username, password, port)
        }
        catch(e){
            var response = 500
        }
        if(response === 500){
            alert('Login Failed')
            setloading(false)
        }       
        else if(response.data.status === 200){
            props.callback(ip, username, password, port)
        }
        else{
            alert('Login Failed')
	    setloading(false)
        }

    }


    return (
            <div>
                <div className="card border-primary mb-3">
                    <div className='card-body'>
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
                        <br/>
                        <input  onClick={() => setloading(true)} style={{marginTop: '30px', marginBottom: '30px'}} type="submit" value="Submit" className="btn btn-primary"/>
                        <br/>
                    </form>
                    </div>
                </div>
            </div>
        );
    }
