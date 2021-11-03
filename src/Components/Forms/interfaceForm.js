import React, { useState, useRef, useEffect  } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import { useQuery } from 'react-query'
import {useRecoilState} from 'recoil';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AES, enc }from 'crypto-js';
import {encytpKey}  from '../../App'
import { ConfigurationModal} from '../Modals/configSendModal'

export function ModifyInterface(props){
    const interfaceForm = useRef();
    const interfaceHtml = useRef();
    const statusHtml = useRef();
    const speedHtml = useRef();
    const [interfaces, setInterfaces] = useState(props.interfaces)
    const [ip, setIp] = useState(undefined)
    const [mask, setMask] = useState(undefined)
    const [portStatus, setPortStatus] = useState(undefined)
    const [speed, setSpeed] = useState(undefined)
    const [showSpeed, setShowSpeed] = useState(true)
    const [description, setDescription] = useState(undefined)
    const [selectedInt, setSelectedInt] = useState(undefined)
    const [newSelectedInt, setNewSelectedInt] = useState(undefined)
    const [decrypt] = useRecoilState(encytpKey);
    const [modalShow, setModalShow] = React.useState(false);
    const [msg, setMsg] = useState('Sending Config')
    const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
    const {refetch, data} = useQuery(localStorage.getItem('ip') + 'modifyInterfaceConfig', async () => {
        if(newSelectedInt === undefined){
            const data = await axios.post('/modifyconfig', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
                    'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port'),
                    'data': {'type': 'interface', 'name': selectedInt.data.name, 'mask': mask, 'ip': ip, 'mask': mask, 'portStatus': portStatus, 'speed': speed, 'description': description}}).then(response => {

                    if(response.data.data.status === 'successful'){
                        setMsg('Configuration Successful')
                    }
                    else{
                        setMsg('Configuration Failed')
                    }

            }).catch((e) => {
                console.log(e)

            })
        }
        else{
            const data = await axios.post('/modifyconfig', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
                    'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port'),
                    'data': {'type': 'interface', 'name': newSelectedInt, 'mask': mask, 'ip': ip, 'mask': mask, 'portStatus': portStatus, 'speed': speed, 'description': description} }).then(response => {

                    if(response.data.data.status === 'successful'){
                        setMsg('Configuration Successful')
                    }
			        else{
                        setMsg('Configuration Failed')
                    }

            }).catch((e) => {
                console.log(e)
            })            
        }
    },
    {enabled: false} );



    const handleSubmit =  (evt) => {
        setModalShow(true)
        if(newSelectedInt === undefined){
            evt.preventDefault();
            refetch();
	    }
        else{
            evt.preventDefault();
            refetch();
        }
    }
    
    const changeInterface = (value) => {

        setIp(undefined)
        setSpeed(undefined)
        setMask(undefined)
        setDescription(undefined)
        setPortStatus(undefined)

        if(value.type === "new"){
	
	        setShowSpeed(true)
            setSelectedInt(undefined);
            setNewSelectedInt(undefined);
    	    interfaceHtml.current = null
            statusHtml.current = null
            speedHtml.current = null
            interfaceForm.current.reset();
        }
        else{
            if(value.data.name.includes('Loopback')){
               setShowSpeed(false)
	        }
            else{
		        setShowSpeed(true)
	        }

            setNewSelectedInt(undefined);
            setSelectedInt(value);
            interfaceForm.current.reset();
        }
    }

    const configureLogicalInterface = (value) => {
        if(value.toLowerCase().includes('loopback')){
           setNewSelectedInt(value)
           setShowSpeed(false)

        }
        else{
	        !showSpeed ? setShowSpeed(true) :
            setNewSelectedInt(value);
        }
    }

    const resetPageStatus = () => {
        setMsg('Sending Config')
        setModalShow(false)
    }

    useEffect(() => {
        setInterfaces(props.interfaces)
        try{
            Object.values(props.interfaces).map(value => {
                if(value.data.name === selectedInt.data.name){
                    setSelectedInt(value);
                }
            })
        }
        catch{}

    }, [props.interfaces])
    
   if(data){
        if(selectedInt !== undefined){
	
            if(ip === undefined || ip.length === 0){
                var ipAddress = selectedInt.data.ipv4
            }
            else{
                var ipAddress = ip
            }

            if(mask === undefined || mask.length === 0){
                var subnetMask = selectedInt.data["ipv4-subnet-mask"]
            }
            else{
                var subnetMask = mask
            }
            
            interfaceHtml.current = <h5>&nbsp;&nbsp;ip address {ipAddress} <span>{subnetMask}</span></h5>
	
            if(portStatus === undefined){
                if(selectedInt.data["oper-status"] === 'up'){
                    statusHtml.current = <h5>&nbsp;&nbsp;no shutdown</h5>
                }
                else if(selectedInt.data["oper-status"] === 'down'){
                    statusHtml.current = <h5>&nbsp;&nbsp;shutdown</h5>
                }
            }
            else if(portStatus === 'up'){
                statusHtml.current = <h5>&nbsp;&nbsp;no shutdown</h5>
            }
            else if(portStatus === 'down'){
                statusHtml.current = <h5>&nbsp;&nbsp;shutdown</h5>
            }

            if(speed === undefined){
                speedHtml.current = <h5>&nbsp;&nbsp;speed {selectedInt.data.speed}</h5>
            }
            else if(speed !== undefined || speed === ''){
                speedHtml.current = <h5>&nbsp;&nbsp;speed {speed}</h5>
            }
        }
        else if(newSelectedInt !== undefined){
	    
            if(ip !== undefined && mask === undefined || mask === ''){
                interfaceHtml.current = <h5>&nbsp;&nbsp;ip address {ip} <span></span></h5>
            }
            else if(ip === undefined || ip === '' && mask !== undefined){
                interfaceHtml.current = <h5>&nbsp;&nbsp;ip address <span>{mask}</span></h5>
            }
            else if(ip !== undefined && mask !== undefined){
                interfaceHtml.current = <h5>&nbsp;&nbsp;ip address {ip} <span>{mask}</span></h5>
            }
	    
	    if(portStatus === 'up'){
                statusHtml.current = <h5>&nbsp;&nbsp;no shutdown</h5>
            }
            else if(portStatus === 'down'){
                statusHtml.current = <h5>&nbsp;&nbsp;shutdown</h5>
            }
	    if(!showSpeed){
		    speedHtml.current = null
	    }
            else if(speed === undefined || speed === ''){
                speedHtml.current = <h5>&nbsp;&nbsp;speed </h5>
            }
            else if(speed !== undefined){
                speedHtml.current = <h5>&nbsp;&nbsp;speed {speed}</h5>
            }
        }
    }
    
    return <>
                <Col xl={5}>
                    <Form controlId="interfaceSelect" bg={"dark"} className="mb-3">
                        <Form.Select size="sm" className=" mb-3" style={{marginLeft: "19px"}} onChange={e => changeInterface(JSON.parse(e.target.value))}>
                            <option>Select Interface</option>
                            <option value={JSON.stringify({'type': "new"})}>New Logical Interface</option>
                            {Object.values(interfaces).map((value) => (
                                <option value={JSON.stringify(value)}>{value.interface}</option>
                            ))}
                        </Form.Select>
                    </Form>
                </Col>
                <>
                { selectedInt !== undefined && newSelectedInt === undefined ?
                        <Row>
                            <Col xl={6}>
                            <Card bg={"dark"} style={{textAlign: 'left'}}>
                                <Card.Body>
                                   <Row className="mb-3">
                                        <Col xl={10} style={{textAlign: 'left', fontFamily: 'Courier'}}>
                                            <h5> Interface {selectedInt.data.name}</h5>
                                            {interfaceHtml.current}
                                            {description  === undefined || description === '' ? <h5>&nbsp;&nbsp;description {selectedInt.data.description}</h5> : <h5>&nbsp;&nbsp;description {description}</h5>}
                                            {speedHtml.current}
                                            {statusHtml.current}
                                        </Col>
                                    </Row>                                    
				                    <Form ref={interfaceForm} onSubmit={handleSubmit}>
                                        <Row>
                                            <Form.Group as={Col} controlId="ip">
                                                <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>IP Address</Form.Label>
                                                <Form.Control size="sm" className="form-control Form.Control-text mb-3" onChange={e => setIp(e.target.value)} placeholder={selectedInt.data.ipv4} name={selectedInt.data.ipv4} style={{textAlign: 'left', fontWeight: 'bold'}}/>
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="mask">
                                                <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Mask</Form.Label>
                                                <Form.Control size="sm" className="form-control Form.Control-text mb-3" onChange={e => setMask(e.target.value)} placeholder={selectedInt.data["ipv4-subnet-mask"]} name={selectedInt.data["ipv4-subnet-mask"]} style={{textAlign: 'left', fontWeight: 'bold' }}/>
                                            </Form.Group>
                                        </Row>
                                            <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Description</Form.Label>
                                            <Form.Control size="sm" className="form-control Form.Control-text mb-3" onChange={e => setDescription(e.target.value)} placeholder={selectedInt.data.description} name={selectedInt.data.description} style={{textAlign: 'left', fontWeight: 'bold'}}/>
                                        <Row>
                                            <Form.Group as={Col} controlId="status">
                                                <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Status</Form.Label>
                                                <Form.Select  size="sm" style={{marginLeft: "19px"}} onChange={e => setPortStatus(e.target.value)} placeholder={selectedInt.data["oper-status"]} name={selectedInt.data["oper-status"]} style={{textAlign: 'left', fontWeight: 'bold'}}>
                                                    <option>Current Status === {selectedInt.data["oper-status"]}</option>
                                                    <option value="up">no shutdown</option>
                                                    <option value="down">shutdown</option>
                                                </Form.Select>
                                            </Form.Group>

                                            { showSpeed ? 

                                            <Form.Group as={Col} controlId="speed">
                                                <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Speed</Form.Label>
                                                <Form.Control size="sm" className="mb-3" onChange={e => setSpeed(e.target.value)}  placeholder={selectedInt.data.speed} style={{textAlign: 'left', fontWeight: 'bold'}}/>
                                            </Form.Group> 
                                                        :
                                            <Form.Group as={Col} controlId="speed">
                                                <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Speed</Form.Label>
                                                <Form.Control size="sm" className="mb-3" placeholder="Can't Set Speed" style={{textAlign: 'left', fontWeight: 'bold'}} disabled/>
                                            </Form.Group>}    

                                        </Row>
                                        <Row>
				  	                    <Col xl={2}>
                                		    <Form.Control type="submit" value="Submit" className="btn btn-success mt-3"/>
                                        </Col>
                                    </Row>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={6} >
                        <Card bg={"dark"} style={{textAlign: 'left'}}>
                            <Card.Body>
                                {parseFloat(selectedInt.data['statistics']['tx-kbps']) === 0 && parseFloat(selectedInt.data['statistics']['rx-kbps']) === 0 ? <Card.Title className="mb-4" style={{color: 'white', textAlign: 'center', fontFamily: 'Courier'}}>Current Interface Stats</Card.Title>
                                :
                                <Card.Title style={{color: 'white', textAlign: 'center', fontFamily: 'Courier'}}>Current Interface Stats<span style={{color: 'yellow', fontSize: 16}}> *Interface Active</span></Card.Title>}
                                <Row ><Col xl={2}/>
                                    <Col xl={5} style={{textAlign: 'left', fontFamily: 'Courier'}}>
                                        <h5 className="mt-4">Speed: {Math.round(parseInt(selectedInt.data.speed) / 1000000000) * 1000 } (Mbps)</h5 >
                                        <h5 className="mt-1">Status: {selectedInt.data['oper-status']}</h5>
                                        <h5 className="mt-1">Descr: {selectedInt.data.description}</h5>
                                        <h5 className="mt-1">MTU: {selectedInt.data.mtu}</h5>

                                        {parseFloat(selectedInt.data['statistics']['tx-kbps']) === 0 && parseFloat(selectedInt.data['statistics']['rx-kbps']) === 0 ? <h5 className="mt-1">Mbps Out: {selectedInt.data['statistics']['tx-kbps']} ({selectedInt.data.outbandwidthDiff})</h5>
                                        :
                                        <h5 className="mt-1" style={{color: 'yellow'}}>*Mbps Out: {selectedInt.data['statistics']['tx-kbps']} ({selectedInt.data.outbandwidthDiff})</h5>
                                        }

                                        {parseFloat(selectedInt.data['statistics']['tx-kbps']) === 0 && parseFloat(selectedInt.data['statistics']['rx-kbps']) === 0 ? <h5 className="mt-1">Mbps In: {selectedInt.data['statistics']['rx-kbps']} ({selectedInt.data.inbandwidthDiff})</h5>
                                        :
                                        <h5 className="mt-1" style={{color: 'yellow'}}>*Mbps In: {selectedInt.data['statistics']['rx-kbps']} ({selectedInt.data.inbandwidthDiff})</h5>
                                        }

                                </Col>
                                <Col xl={5} style={{fontFamily: 'Courier'}}>
                                    <h5 className="mt-4">PPs Out: {selectedInt.data['statistics']['rx-pps']}</h5>
                                    <h5 className="mt-1">PPs In: {selectedInt.data['statistics']['tx-pps']}</h5>
                                    <h5 className="mt-1">LastChange: {selectedInt.data['statistics']['discontinuity-time'].split('.')[0]}</h5>
                                </Col>
                                <Col xl={2}/>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                : 
                <Col xl={6}>
                    <Card bg={"dark"} style={{textAlign: 'left'}}>
                        <Card.Body>
                            <Col xl={10} style={{textAlign: 'left', fontFamily: 'Courier'}}>
                                <h5> Interface {newSelectedInt}</h5>
                                {interfaceHtml.current}
                                <h5>&nbsp;&nbsp;description {description}</h5>
                                {speedHtml.current}
                                {statusHtml.current}
                            </Col>
                            <Form ref={interfaceForm} onSubmit={handleSubmit}>
                                <Row>
                                    <Form.Group as={Col} controlId="interface">
                                            <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Interface Name</Form.Label>
                                            <Form.Control size="sm" className=" mb-3" onChange={e => configureLogicalInterface(e.target.value)}  style={{textAlign: 'left', fontWeight: 'bold'}}/>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group as={Col} controlId="ip">
                                        <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>IP Address</Form.Label>
                                        <Form.Control size="sm" className="mb-3" onChange={e => setIp(e.target.value)}  style={{textAlign: 'left', fontWeight: 'bold'}}/>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="mask">
                                        <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Mask</Form.Label>
                                        <Form.Control size="sm" className="mb-3" onChange={e => setMask(e.target.value)}  style={{textAlign: 'left', fontWeight: 'bold' }}/>
                                    </Form.Group>
                                </Row>
                                    <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Description</Form.Label>
                                    <Form.Control size="sm" className="mb-3" onChange={e => setDescription(e.target.value)}  style={{textAlign: 'left', fontWeight: 'bold'}}/>
                                <Row>
                                    <Form.Group as={Col} controlId="status">
                                        <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Status</Form.Label>
                                        <Form.Select  size="sm" style={{marginLeft: "19px"}} onChange={e => setPortStatus(e.target.value)}  style={{textAlign: 'left', fontWeight: 'bold'}}>
                                            <option value="up">no shutdown</option>
                                            <option value="down">shutdown</option>
                                        </Form.Select>
                                    </Form.Group>

                                    { showSpeed ? 

                                    <Form.Group as={Col} controlId="speed">
                                        <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Speed</Form.Label>
                                        <Form.Control size="sm"  className=" mb-3" onChange={e => setSpeed(e.target.value)}  style={{textAlign: 'left', fontWeight: 'bold'}}/>
                                    </Form.Group> 
                                            : 
                                    <Form.Group as={Col} controlId="speed">
                                        <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Speed</Form.Label>
                                        <Form.Control  size="sm" className="mb-3" placeholder="Can't Set Speed" style={{textAlign: 'left', fontWeight: 'bold'}} disabled/>
                                    </Form.Group>}

                                </Row>
                                <Row>
                                    <Col xl={2}>
                                	    <Form.Control type="submit" value="Submit" className="btn btn-success mt-3"/>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
        
        }
	    {modalShow ? <ConfigurationModal msg={msg} show={modalShow} onHide={() => resetPageStatus()}/> : <></>}
        </>
    </>
       
    }