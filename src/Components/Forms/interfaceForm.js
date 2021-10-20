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

export function ModifyInterface(props){
    const interfaceForm = useRef();
    const [interfaces, setInterfaces] = useState(props.interfaces)
    const [ip, setIp] = useState(undefined)
    const [mask, setMask] = useState(undefined)
    const [portStatus, setPortStatus] = useState(undefined)
    const [speed, setSpeed] = useState(undefined)
    const [description, setDescription] = useState(undefined)
    const [selectedInt, setSelectedInt] = useState(undefined)
    const [decrypt] = useRecoilState(encytpKey);
    const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
    const { isLoading, error, data, isFetching, refetch } = useQuery(localStorage.getItem('ip') + 'modifyInterfaceConfig', async () => {

        const data = await axios.post('/modifyconfig', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
                            'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port'),
                            'data': {'type': 'interface', 'ip': ip, 'mask': mask, 'portStatus': portStatus, 'speed': speed, 'description': description} })

        return data.data

    },
    {enabled: false} );

    const handleSubmit =  (evt) => {
        evt.preventDefault();
        refetch()};  

    const changeInterface = (value) => {
        setSelectedInt(value);
        interfaceForm.current.reset();
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
    
    return <div>
                <Col xl={5}>
                    <Form controlId="interfaceSelect" bg={"dark"} className="mb-3">
                        <Form.Select style={{marginLeft: "19px"}} onChange={e => changeInterface(JSON.parse(e.target.value))}>
                            <option>Select Interface</option>
                            {Object.values(interfaces).map((value) => (
                                <option value={JSON.stringify(value)}>{value.interface}</option>
                            ))}
                        </Form.Select>
                    </Form>
                </Col>
                <div>
                { selectedInt !== undefined ?
                        <Row><Col xl={6}>
                            <Card bg={"dark"} style={{textAlign: 'left'}}>
                                <Card.Body>
                                    {selectedInt.data.ipv4 === localStorage.getItem('ip') ? <Card.Title className="mb-4">Interface {selectedInt.data.name}: <span style={{color: 'yellow'}}>  Warning, Current Connection</span></Card.Title> 
                                    : 
                                    <Card.Title className="mb-4" style={{color: 'white'}}>Modifying: {selectedInt.data.name}</Card.Title>}
                                        <Form ref={interfaceForm} onSubmit={handleSubmit}>
                                            <Row>
                                                <Form.Group as={Col} controlId="p">
                                                    <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>IP Address</Form.Label>
                                                    <input  type="text" className="form-control input-text mb-3" onChange={e => setIp(e.target.value)} placeholder={selectedInt.data.ipv4} name={selectedInt.data.ipv4} style={{textAlign: 'left', fontWeight: 'bold'}}/>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="mask">
                                                    <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Mask</Form.Label>
                                                    <input  type="text" className="form-control input-text mb-3" onChange={e => setMask(e.target.value)} placeholder={selectedInt.data["ipv4-subnet-mask"]} name={selectedInt.data["ipv4-subnet-mask"]} style={{textAlign: 'left', fontWeight: 'bold' }}/>
                                                </Form.Group>
                                            </Row>
                                                <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Description</Form.Label>
                                                <input  type="text" className="form-control input-text mb-3" onChange={e => setDescription(e.target.value)} placeholder={selectedInt.data.description} name={selectedInt.data.description} style={{textAlign: 'left', fontWeight: 'bold'}}/>
                                            <Row>
                                                <Form.Group as={Col} controlId="mask">
                                                    <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Status</Form.Label>
                                                    <Form.Select  style={{marginLeft: "19px"}} onChange={e => setPortStatus(e.target.value)} placeholder={selectedInt.data["oper-status"]} name={selectedInt.data["oper-status"]} style={{textAlign: 'left', fontWeight: 'bold'}}>
                                                        <option >Current Status === {selectedInt.data["oper-status"]}</option>
                                                        <option value="up">no shutdown</option>
                                                        <option value="down">shutdown</option>
                                                    </Form.Select>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="mask">
                                                    <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Speed</Form.Label>
                                                    <input  type="text" className="form-control input-text mb-3" onChange={e => setSpeed(e.target.value)} placeholder={selectedInt.data.speed} name={selectedInt.data.speed} style={{textAlign: 'left', fontWeight: 'bold'}}/>
                                                </Form.Group>
                                            </Row>
                                            <input type="submit" value="Submit" className="btn btn-success mt-3"/>
                                        </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={6} >
                        <Card bg={"dark"} style={{textAlign: 'left'}} className="border-success">
                            <Card.Body>
                                {parseFloat(selectedInt.data['statistics']['tx-kbps']) === 0 && parseFloat(selectedInt.data['statistics']['rx-kbps']) === 0 ? <Card.Title className="mb-4" style={{color: 'white', textAlign: 'center'}}>Current Interface Stats</Card.Title>
                                :
                                <Card.Title className="mb-4" style={{color: 'white', textAlign: 'center'}}>Current Interface Stats<span style={{color: 'yellow', fontSize: 16}}> *Interface Active</span></Card.Title>}
                                <Row ><Col xl={2}/>
                                    <Col xl={5}>
                                        <p className="mt-4">Speed: {Math.round(parseInt(selectedInt.data.speed) / 1000000000) * 1000 } (Mbps)</p>
                                        <p className="mt-1">Status: {selectedInt.data['oper-status']}</p >
                                        <p className="mt-1">Descr: {selectedInt.data.description}</p >
                                        <p className="mt-1">MTU: {selectedInt.data.mtu}</p >

                                        {parseFloat(selectedInt.data['statistics']['tx-kbps']) === 0 && parseFloat(selectedInt.data['statistics']['rx-kbps']) === 0 ? <p className="mt-1">Mbps Out: {selectedInt.data['statistics']['tx-kbps']} ({selectedInt.data.outbandwidthDiff})</p>
                                        :
                                        <p className="mt-1" style={{color: 'yellow'}}>*Mbps Out: {selectedInt.data['statistics']['tx-kbps']} ({selectedInt.data.outbandwidthDiff})</p >
                                        }

                                        {parseFloat(selectedInt.data['statistics']['tx-kbps']) === 0 && parseFloat(selectedInt.data['statistics']['rx-kbps']) === 0 ? <p className="mt-1">Mbps In: {selectedInt.data['statistics']['rx-kbps']} ({selectedInt.data.inbandwidthDiff})</p>
                                        :
                                        <p className="mt-1" style={{color: 'yellow'}}>*Mbps In: {selectedInt.data['statistics']['rx-kbps']} ({selectedInt.data.inbandwidthDiff})</p >
                                        }

                                </Col>
				<Col xl={5}>
					<p className="mt-4">PPs Out: {selectedInt.data['statistics']['rx-pps']}</p >
                                        <p className="mt-1">PPs In: {selectedInt.data['statistics']['tx-pps']}</p >
					<p className="mt-1">LastChange: {selectedInt.data['statistics']['discontinuity-time'].split('.')[0]}</p >
				</Col>

				<Col xl={2}/>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col></Row>
            : <div/>}

                        </div>
                    </div>
                    
            
        }