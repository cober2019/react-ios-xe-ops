import React, { useState, useEffect, useRef } from 'react';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import {useRecoilState} from 'recoil';
import { ErrorBoundary } from  'react-error-boundary'
import {encytpKey, client}  from '../../App'
import { useQuery } from 'react-query'
import { NavigationFallback }  from '../Other/navbarError'
import { RestConfigNavbar } from "../Other/configNavbar";
import { ApiRequest } from '../Other/axiosRequests';
import { RestQueryModal } from '../Modals/configQueryModal'


export  function RestConfig(props){
    const [decryptKey] = useRecoilState(encytpKey);
    const [model, updateModel] = useState(undefined)
    const [urlSate, setUrlState] =  useState(false)
    const [msg, setMsg] = useState('Fetching')
    const [modalShow, setModalShow] = React.useState(false);
    const queryType = useRef()
    const xpathHistory = useRef([])
    const pythonPath = useRef([])
    const url = useRef(undefined)
    const pythonStrPath = useRef('{PythonVar}')
    const leafs = useRef(false)
    const parentKey = useRef(false)
    const config = useRef(false)
    const avaiableUrls = useRef(['Cisco-IOS-XE-arp-oper:arp-data', 'openconfig-platform-transceiver:transceiver', 'Cisco-IOS-XE-interfaces-oper:interfaces',
                                 'Cisco-IOS-XE-native:native', 'Cisco-IOS-XE-process-cpu-oper:cpu-usage',
                                'Cisco-IOS-XE-platform-software-oper:cisco-platform-software',
                                'Cisco-IOS-XE-environment-oper:environment-sensors', 'openconfig-platform:components',
                                'Cisco-IOS-XE-ospf-oper:ospf-oper-data/ospf-state', 'Cisco-IOS-XE-matm-oper:matm-oper-data',
                                'Cisco-IOS-XE-spanning-tree-oper:stp-details', 'Cisco-IOS-XE-cdp-oper:cdp-neighbor-details',
                                'Cisco-IOS-XE-lldp-oper:lldp-entries', 'Cisco-IOS-XE-vlan-oper:vlans', 'Cisco-IOS-XE-bgp-oper:bgp-state-data',
                                'Cisco-IOS-XE-hsrp-oper:hsrp-oper-data',' Cisco-IOS-XE-matm-oper:matm-oper-data'])
                                
    const {error, data, isLoading, isFetching, refetch } = useQuery(localStorage.getItem('ip') + ':restQuery', async () => {
            
            setModalShow(true)
            setMsg('Fetching')
            const response = await ApiRequest(decryptKey, '/query', url.current)

            return response

        },
        {  enabled: false}
    )
    
    const previousSelection = async () => {

        if(xpathHistory.current.length !== 0)
            if (xpathHistory.current.length === 1){
                let response = await refetch();

                if (response.data.data.status !== 200){
                    setMsg(String(response.data.data.status) + ' Error')
                }
                else{
                    pythonStrPath.current = '{PythonVar}'
                    xpathHistory.current.push(url.current);                
                    config.current = JSON.parse(response.data.data.config)
                    parentKey.current = response.data.data.parent
                    leafs.current = response.data.data.data
                    setModalShow(false)
                }
            }

            else{
                pythonStrPath.current = '{PythonVar}'
                url.current = xpathHistory.current[xpathHistory.current.length - 2];
                let response = await refetch();

                if (response.data.data.status !== 200){
                    setMsg(String(response.data.data.status) + ' Error')
                }
                else{
                    pythonStrPath.current = pythonPath.current[pythonPath.current.length - 2];
                    config.current = JSON.parse(response.data.data.config)
                    parentKey.current = response.data.data.parent
                    leafs.current = response.data.data.data
                    xpathHistory.current.pop();
                    pythonPath.current.pop();
                    setModalShow(false)
                }
                           
            }
    };

    const buildUri =  async (nextPath) => {

        pythonStrPath.current === undefined ? pythonStrPath.current = '{PythonVar}' : pythonStrPath.current = pythonStrPath.current
        url.current = url.current + '/' + nextPath;
        
        let response = await refetch();

        if (response.data.data.status === 404){

            let index = leafs.current.indexOf(nextPath);
            url.current = xpathHistory.current[xpathHistory.current.length - 1] + '=' + encodeURIComponent(nextPath) + '/';
            let response = await refetch();

            if (response.data.data.status !== 200){
                setMsg(String(response.data.data.status) + ' Error');
            }
            else{
                pythonStrPath.current = pythonStrPath.current + '.get(\'' + nextPath + '\')';
                pythonPath.current.push(pythonPath.current  + '[' + index + ']');
                config.current = JSON.parse(response.data.data.config);
                parentKey.current = response.data.data.parent;
                leafs.current = response.data.data.data;
                xpathHistory.current.push(url.current);
                setModalShow(false);
            }
        }
        else if(response.data.data.status !== 200){
            setMsg(String(response.data.data.status) + ' Error')
        }
        else{

            pythonStrPath.current = pythonStrPath.current + '.get(\'' + nextPath + '\')';
            pythonPath.current.push(pythonStrPath.current);
            config.current = JSON.parse(response.data.data.config);
            parentKey.current = response.data.data.parent;
            leafs.current = response.data.data.data;
            xpathHistory.current.push(url.current);
            setModalShow(false);
        }
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        if(url.current !== undefined && url.current !== 'https://'+ localStorage.getItem('ip')  + ':443/restconf/data/'){
            let response = await refetch();

            if (response.data.data.status !== 200){
                setMsg(String(response.data.data.status) + ' Error')
            }
            else{
                config.current = JSON.parse(response.data.data.config)
                parentKey.current = response.data.data.parent
                leafs.current = response.data.data.data
                xpathHistory.current.push(url.current);
                setUrlState(true)
                setModalShow(false)
            }
        }
        else{
            setMsg('Please Enter a YANG Model')
            setModalShow(true);
        }
      }
      
    
    const handleChange = (e) => {
        
        if(e.target.name === 'freeForm'){
            queryType.current = e.target.name
            url.current = 'https://'+ localStorage.getItem('ip')  + ':443/restconf/data/' + e.target.value
        }
        else{
            queryType.current = e.target.name
            url.current = 'https://'+ localStorage.getItem('ip')  + ':443/restconf/data/' + e.target.value
        }
        updateModel(e.target.value)
    }

    if(urlSate){

        return  < Container fluid>
                    <ErrorBoundary FallbackComponent={NavigationFallback}>
                        <RestConfigNavbar update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
                    </ErrorBoundary>
                    <Row>
                        <Col xl={4}>
                            <Card bg={"dark"} className="mt-3">
                                <Card.Body>
                                        <Form onSubmit={handleSubmit}>
                                            <div className="form-group row">
                                                <Col xl={12} style={{textAlign: 'left'}}>
                                                    <Form.Label style={{textAlign: 'left', fontWeight: 'bold', color: 'white'}}>Model: </Form.Label>
                                                    <Form.Select size="sm" name="model" name="select" value={model} onChange={handleChange}>
                                                    <option >Select...</option>
                                                        {
                                                        avaiableUrls.current.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))
                                                        }
                                                    </Form.Select>
                                                </Col>
                                            <Form.Group  as={Col} controlId="remoteAs" style={{textAlign: 'left'}}>
                                                <Form.Label className="mt-3" style={{textAlign: 'left', fontWeight: 'bold', color: 'white'}} >Free Form</Form.Label>
                                                <Form.Control onChange={handleChange} className="mb-3" size="sm" placeholder="Ex. Cisco-IOS-XE-native:native" name="freeForm" style={{textAlign: 'left'}}/>
                                            </Form.Group>
                                            </div>
                                            <Col xl={2}>
                                                <Form.Control type="submit" value="Submit" className="btn btn-sm btn-success mt-3"/>
                                            </Col>
                                        </Form> 
                                    </Card.Body>
                                </Card>
                                <Card bg={"dark"} className="mt-3">
                                    <Card.Body>
                                        <Row style={{textAlign: 'left'}}>
                                            <Col xl={3}>
                                                <button style={{marginBottom: '15px', fontWeight: 'bold'}} className="btn btn-success btn-sm" onClick={(e) => previousSelection(e)}>Previous URI</button>
                                            </Col>
                                            {isFetching ? 
                                            <Row>
                                                <h6 style={{color: "yellow", fontWeight: 'bold'}}>Current Path: </h6><h6 key={'currentpath'}className="fade-in" >Current Path: Updating...</h6>
                                            </Row>
                                            :
                                            <Row>
                                                <h6 style={{color: "yellow", fontWeight: 'bold'}}>Current Path: </h6><h6 key={'currentpath'}className="fade-in" >{url.current}</h6>
                                            </Row>
                                                }
                                        </Row>
                                    </Card.Body>
                                </Card>
                                </Col>
                                <Col xl={8}>
                                    <Card bg={"dark"} className="mt-3">
                                        <Card.Body style={{textAlign: 'left'}}>
                                            <Row>
                                                <Col xl={12}>
                                                        { leafs.current.map((key, index) => (
                                                            <button key={key + index} style={{marginRight: '3px'}} className="btn btn-success fade-in mb-3" onClick={(e) => buildUri(key, e)}>{key}</button>
                                                        ))
                                                        }
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={12}>
                                                    <pre  className="fade-in" key={'test'} style={{fontWeight:'bold', textAlign: 'left'}}>{JSON.stringify(config.current, null, 2)}</pre>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                    {modalShow ? <RestQueryModal msg={msg} show={modalShow} onHide={() => setModalShow(false)}/> : <></>}
                </Container>
    }
      else{
        return <Container fluid>
                    <ErrorBoundary FallbackComponent={NavigationFallback}>
                  <RestConfigNavbar update={data} ip={localStorage.getItem('ip')} fetchingStatus={isFetching}/>
                </ErrorBoundary>
                        <Row>
                            <Col xl={4}>
                            <Card bg={"dark"} className="mt-3">
                                <Card.Body>
                                        <Form onSubmit={handleSubmit}>
                                            <div className="form-group row">
                                                <Col xl={12} style={{textAlign: 'left'}}>
                                                    <Form.Label style={{textAlign: 'left', fontWeight: 'bold', color: 'white'}}>Model: </Form.Label>
                                                    <Form.Select size="sm" name="select" value={model} onChange={handleChange}>
                                                    <option >Select...</option>
                                                        {
                                                        avaiableUrls.current.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))
                                                        }
                                                    </Form.Select>
                                                </Col>
                                            </div>
                                            <Form.Group  as={Col} controlId="remoteAs" style={{textAlign: 'left'}}>
                                                <Form.Label className="mt-3" style={{textAlign: 'left', fontWeight: 'bold', color: 'white'}} >Free Form</Form.Label>
                                                <Form.Control onChange={handleChange} className="mb-3" size="sm" placeholder="Ex. Cisco-IOS-XE-native:native" name="freeForm" style={{textAlign: 'left'}}/>
                                            </Form.Group>
                                            <Col xl={2}>
                                                <Form.Control type="submit" value="Submit" className="btn btn-sm btn-success mt-3"/>
                                            </Col>
                                        </Form> 
                                    </Card.Body>
                                </Card>
                            </Col>
                       </Row>
                       {modalShow ? <RestQueryModal msg={msg} show={modalShow} onHide={() => setModalShow(false)}/> : <></>}
                    </Container>

      }                          
}
        
    
