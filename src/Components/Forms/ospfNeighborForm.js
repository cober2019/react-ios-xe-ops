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

export function ModifyOspfNeighbor(props){
    const bgpForm = useRef();
    const [network, setNetwork] = useState(undefined)
    const [wildcard, setWildcard] = useState(undefined)
    const [decrypt] = useRecoilState(encytpKey);
    const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
    const { isLoading, error, data, isFetching, refetch } = useQuery(localStorage.getItem('ip') + 'modifyOspfNeighbor', async () => {

        const data = await axios.post('/modifyOspfNeighbor', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
                            'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port'),'data': {'type': 'ospf', 'network': network, 'wildcard': wildcard}})

        return data.data

    },
    {enabled: false} );

    const handleSubmit =  (evt) => {
        evt.preventDefault();
        refetch()};  

    return <Card bg={"dark"} style={{textAlign: 'left'}}>
                <Card.Body>
                    <Card.Title className="mb-4" style={{color: 'white', textAlign: "center"}}>Add OSPF Network</Card.Title>
                        <Form ref={bgpForm} onSubmit={handleSubmit}>
                            <Row>
                                <Form.Group as={Col} controlId="network">
                                    <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Network</Form.Label>
                                    <input  type="text" className="form-control input-text mb-3" onChange={e => setNetwork(e.target.value)} placeholder="Network" name="network" style={{textAlign: 'left', fontWeight: 'bold' }}/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="network">
                                    <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Network</Form.Label>
                                    <input  type="text" className="form-control input-text mb-3" onChange={e => setWildcard(e.target.value)} placeholder="Wildcard" name="wildcard" style={{textAlign: 'left', fontWeight: 'bold' }}/>
                                </Form.Group>
                            </Row>
                            <input type="submit" value="Submit" className="btn btn-success mt-3"/>
                        </Form>
                </Card.Body>
            </Card>
                    
            
        }