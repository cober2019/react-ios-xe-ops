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
import { CreateCard } from '../Other/jsxCard';
import { BgpTableHtml } from '../Other/chartConfigs';
import { BgpData } from '../Other/tables';
import { PrefixList } from '../Policies/prefixList';
import { ConfigurationModal} from '../Modals/configSendModal'

const $ = require('jquery');
$.DataTable = require('datatables.net');

export function ModifyBgpNeighbor(props){
    const bgpForm = useRef();
    const policyHtml = useRef();
    const routerIdHtml = useRef()
    const localAsHtml= useRef()
    const showPrefixListOption = useRef(false)
    const showRouteMapOption = useRef(false)
    const showPrefixList = useRef(false)
    const showRouteMap = useRef(false)
    const bgpTableRef = React.createRef()
    const bgpTable = BgpTableHtml(bgpTableRef)
    const [neighbor, setNeighbor] = useState(undefined)
    const [autosys, setAutosys] = useState(undefined)
    const [localAs, setLocalAs] = useState(props.localAs)
    const [routerId, setRouterId] = useState('')
    const [policyType, setPolicyType] = useState('none:none')
    const [policyDirection, setDirection] = useState(undefined)
    const [decrypt] = useRecoilState(encytpKey);
    const [modalShow, setModalShow] = React.useState(false);
    const [msg, setMsg] = useState('Sending Config')
    const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decrypt);
    const { isLoading, error, data, isFetching, refetch } = useQuery(localStorage.getItem('ip') + 'modifyconfig', async () => {

        const data = await axios.post('/modifyconfig', {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
            'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port'),'data': {'type': 'bgp', 'neighbor': neighbor, 
            'remoteAs': autosys,  'routerId': routerId, 'localAs': localAs, 'policyType': policyType, 'policyDirection': policyDirection}}).then(response => {

                    if(response.data.data.status === 'successful'){
                        setMsg('Configuration Successful')
                    }
                    else{
                        setMsg('Configuration Failed')
                    }

            }).catch((e) => {
                console.log(e)

            })
    },
    {enabled: false} );

    const handleSubmit =  (evt) => {
	    setModalShow(true)
        evt.preventDefault();
        refetch()};  
    
    useEffect(() => {
        try{
            $(bgpTableRef.current).DataTable().clear()
            $(bgpTableRef.current).DataTable().rows.add(props.neighborTable)
            $(bgpTableRef.current).DataTable().draw(false)
        }
        catch{}
    }, [props.neighborTable])

    useEffect(() => {
        $(bgpTableRef.current).DataTable().destroy()
        BgpData(bgpTableRef.current, props.neighborTable)
        
    }, [])

    const resetPageStatus = () => {
        setMsg('Sending Config')
        setModalShow(false)
    }

    if(policyType === undefined || policyType.split(':')[0] === 'none'){
        if(showPrefixList.current){showPrefixList.current = false}
        if(showRouteMap.current){showPrefixList.current = false}
        showPrefixListOption.current = true
        showRouteMapOption.current = true
        policyHtml.current = <h5></h5>
    }
    else if(policyType.split(':')[1] === 'routeMap'){
        showPrefixListOption.current = false
        showRouteMapOption.current = true
        policyHtml.current = <h5>&nbsp;&nbsp;&nbsp;neighbor {neighbor} route-map {policyType.split(':')[0]} {policyDirection}</h5>
    }
    else if(policyType.split(':')[1] === 'prefixList'){
        if(!showPrefixList){showPrefixList.current = true}
        showPrefixListOption.current = true
        showRouteMapOption.current = false
        policyHtml.current = <h5>&nbsp;&nbsp;&nbsp;neighbor {neighbor} prefix-list {policyType.split(':')[0]} {policyDirection}</h5>
    }

    
    if(routerId !== ''){
        routerIdHtml.current = <h5>&nbsp;&nbsp;router-id {routerId}</h5>
    }
    else if(routerId === ''){
        if(props.routerId !== undefined){
            setRouterId(props.routerId)
            routerIdHtml.current = <h5>&nbsp;&nbsp;router-id {props.routerId}</h5>
        }
    }
    else if(props.routerId !== undefined){
        setRouterId(props.routerId)
        routerIdHtml.current = <h5>&nbsp;&nbsp;router-id {props.routerId}</h5>
    }

    if(localAs !== ''){
        localAsHtml.current = <h5 className="mt-4">router bgp {localAs}</h5>
    }
    else if(localAs === ''){
        if(props.localAs !== undefined){
            setLocalAs(props.localAs)
            localAsHtml.current = <h5 className="mt-4">router bgp {props.localAs}</h5>
     	}
        else{
	     localAsHtml.current = <h5 className="mt-4">router bgp {localAs}</h5>
        }
     }
    else if(props.localAs !== undefined){
        setLocalAs(props.localAs)
        localAsHtml.current = <h5 className="mt-4">router bgp {props.localAs}</h5>
    }
     

    return <>
        <Row className="border-bottom mb-3" >
            {CreateCard(bgpTable, "Current  Neighbors")}
        </Row>
        <Row>
        <Col style={{color: 'white',  fontFamily: 'Courier'}}>
            <Card bg={"dark"} style={{textAlign: 'left'}}>
                <Card.Body>
                    {localAsHtml.current}
                    {routerIdHtml.current}
                    {neighbor !== undefined ? <h5>&nbsp;&nbsp;neighbor {neighbor} remote-as {autosys}</h5> : <></>}
                    <h5>&nbsp;&nbsp;!</h5>
                    <h5>&nbsp;&nbsp;address=family-ipv4</h5>
                    {neighbor !== undefined ? <h5>&nbsp;&nbsp;&nbsp;neighbor {neighbor} activate</h5>: <></>}
                    {policyHtml.current}
                    <h5>&nbsp;&nbsp;exit-address-family</h5>
                </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col>
                <Card bg={"dark"} style={{textAlign: 'left'}}>
                    <Card.Body>
                        <Card.Title className="mb-4" style={{color: 'white', textAlign: "center"}}>Add BGP Neighbor</Card.Title>
                            <Form ref={bgpForm} onSubmit={handleSubmit}>
                                <Row>
                                    <Form.Group controlId="neighbor">
                                        <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Local AS</Form.Label>
                                        {props.localAs !== undefined ? <Form.Control className="mb-3"  placeholder={props.localAs} name="RouterId" style={{textAlign: 'left', fontWeight: 'bold'}} disabled/>
                                        :
                                        <Form.Control className="mb-3" size="sm" placeholder="Local AS" onChange={e => setLocalAs(e.target.value)} name="RouterId" style={{textAlign: 'left', fontWeight: 'bold'}}/>
                                        }
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group as={Col} controlId="routerId">
                                        <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Router ID</Form.Label>
                                        <Form.Control className="mb-3" size="sm" onChange={e => setRouterId(e.target.value)} placeholder="RouterId" name="RouterId" style={{textAlign: 'left', fontWeight: 'bold'}}/>
                                    </Form.Group>
                                    <Form.Group  as={Col} controlId="remoteAs">
                                        <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Neighbor</Form.Label>
                                        <Form.Control className="mb-3" size="sm" onChange={e => setNeighbor(e.target.value)} placeholder="Neighbor" name="Neighbor" style={{textAlign: 'left', fontWeight: 'bold' }}/>
                                    </Form.Group>
                                    <Form.Group  as={Col} controlId="remoteAs">
                                        <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Remote-AS</Form.Label>
                                        <Form.Control className="mb-3" size="sm" onChange={e => setAutosys(e.target.value)} placeholder="Remote-as" name="Remote-as" style={{textAlign: 'left', fontWeight: 'bold' }}/>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    {props.prefixLists[0].name !== 'No Prefix-lists Found' && policyType.split(':')[1] !== 'routeMap' ||  showPrefixListOption.current ? 
                                    <Form.Group  as={Col} controlId="prefixLists">
                                        <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Prefix Lists</Form.Label>
                                        <Form.Select size="sm" className="mb-3" aria-label="Prefix-Lists" onChange={e => setPolicyType(e.target.value + ':prefixList')} >
                                            <option value={'none'}>None</option>
                                            {props.prefixLists.map(list => (
                                                <option value={list.name}>{list.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    :
                                    <Form.Group  as={Col} controlId="prefixLists">
                                        <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Prefix Lists</Form.Label>
                                        <Form.Select className="mb-3" size="sm" aria-label="Prefix-Lists" onChange={e => setPolicyType(e.target.value + ':prefixList')} disabled>
                                            <option>PrefixLists Disabled</option>
                                        </Form.Select>
                                    </Form.Group>
                                    
                                    }
                                    { props.routeMaps[0].name !== 'No Route-maps Found' && policyType.split(':')[1] !== 'prefixList'  ||  showRouteMapOption.current ? 
                                    <Form.Group  as={Col} controlId="routeMpas">
                                            <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Route-Maps</Form.Label>
                                            <Form.Select className="mb-3" size="sm" onChange={e => setPolicyType(e.target.value + ':routeMap')}>
                                                <option value={'none'}>None</option>
                                                {props.routeMaps.map(map => (
                                                    <option value={map.name}>{map.name}</option>
                                                ))}
                                            </Form.Select>
                                    </Form.Group>
                                    :
                                    <Form.Group  as={Col} controlId="routeMpas">
                                            <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Route-Maps</Form.Label>
                                            <Form.Select className="mb-3" size="sm" onChange={e => setPolicyType(e.target.value + ':routeMap')} disabled>
                                                <option>RouteMaps Disabled</option>
                                            </Form.Select>
                                    </Form.Group>
                                    }

                                    {props.routeMaps[0].name === 'No Route-maps Found' && props.prefixLists[0].name === 'No Prefix-lists Found' ? 
                                    
                                    <Form.Group  as={Col} controlId="direction">
                                        <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Direction</Form.Label>
                                        <Form.Select  className="mb-3" size="sm" onChange={e => setDirection(e.target.value)} disabled>
                                            <option>No Policies To Apply</option>
                                        </Form.Select>
                                    </Form.Group>
                                    :
                                    <Form.Group  as={Col} controlId="direction">
                                        <Form.Label style={{textAlign: 'left', fontWeight: 'bold'}}>Direction</Form.Label>
                                        <Form.Select className="mb-3" size="sm" onChange={e => setDirection(e.target.value)}>
                                            <option>Direction</option>
                                            <option value="in">Ingress</option>
                                            <option value="out">Egress</option>
                                        </Form.Select>
                                    </Form.Group>
                                    }
                                </Row>
                                    <input type="submit" value="Submit" className="btn btn-success mt-3 mb-3"/>
                                </Form>
                                {showPrefixList.current ? 
				                <Row className="mt-3 border-top">
                                    <Col xl>
                                        {props.prefixLists.map(list => (
                                            <>{policyType.split(':')[0] === list.name ? <PrefixList prefixLists={list}/> : <></>}</>
                                        ))}
                                    </Col>
                                </Row>                                :
                                <></>
                                }
                                {showRouteMap.current ? <Row className="mt-3 border-top">
                                    <Col xl>
                                        {props.prefixLists.map(list => (
                                            <><h3>Nothing to see yet</h3></>
                                        ))}
                                    </Col>
                                </Row>
                                :
                                <></>
                                }
                    </Card.Body>
                </Card>
            </Col>
		{modalShow ? <ConfigurationModal msg={msg} show={modalShow} onHide={() => resetPageStatus()}/> : <></>}
        </Row>
        </>     
        }