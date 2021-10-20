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

export function ModifyBgpNeighbor(props){
    const bgpForm = useRef();
    const [interfaces, setInterfaces] = useState(props.interfaces)
    const [neighbor, setNeighbor] = useState(undefined)
    const [autosys, setAutosys] = useState(undefined)
    const [decrypt] = useRecoilState(encytpKey);
    const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
    const { isLoading, error, data, isFetching, refetch } = useQuery(localStorage.getItem('ip') + 'modifyBgpNeighbor', async () => {

        const data = await axios.post('/modifyBgpNeighbor', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
                            'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port'), 'type': 'interface'})

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

    return <Card bg={"dark"} style={{textAlign: 'left'}}>
                <Card.Body>
                    <Card.Title className="mb-4" style={{color: 'white', textAlign: "center"}}>Add BGP Neighbor</Card.Title>
                        <Form ref={bgpForm} onSubmit={handleSubmit}>
                            <Row>
                                <Form.Group as={Col} controlId="neighbor">
                                    <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Neighbor</Form.Label>
                                    <input  type="text" className="form-control input-text mb-3" onChange={e => setNeighbor(e.target.value)} placeholder="Neighbor" name="neighbor" style={{textAlign: 'left', fontWeight: 'bold'}}/>
                                </Form.Group>
                                <Form.Group as={Col} controlId="remoteAs">
                                    <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Remote-AS</Form.Label>
                                    <input  type="text" className="form-control input-text mb-3" onChange={e => setAutosys(e.target.value)} placeholder="Remote-as" name="Remote-as" style={{textAlign: 'left', fontWeight: 'bold' }}/>
                                </Form.Group>
                            </Row>
                            <input type="submit" value="Submit" className="btn btn-success mt-3"/>
                        </Form>
                </Card.Body>
            </Card>
                    
            
        }