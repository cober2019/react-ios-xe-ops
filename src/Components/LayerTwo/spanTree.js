import React, { useEffect } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { SpanTreeHtml } from '../Other/chartConfigs';
import { SpanTableData } from '../Other/tables';
import { CreateCard } from '../Other/jsxCard';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export  function SpanTable(props){
  const spanTableRef = React.createRef()
  const spanTable = SpanTreeHtml(spanTableRef)
  $.fn.dataTable.ext.errMode = 'none';
  
  useEffect(() => {
    if(spanTableRef.current !== null){
      try{
        $(spanTableRef.current).DataTable().clear()
        $(spanTableRef.current).DataTable().rows.add(Object.values(props.macs))
        $(spanTableRef.current).DataTable().draw(false)
      }
      catch{}
    }

    }, [props.macs])


  useEffect(() => {
    $(spanTableRef.current).DataTable().destroy()
    SpanTableData(spanTableRef.current,props.macs )
     
}, [])

  if(Object.keys(props.span).length !== 0){
    return    <Card bg={"dark"}  className="border-bottom">
                  <Card.Body>
                      <Row>
                        <Col xl={12}>
                          <Card.Title className="mb-3">{props.span.instance}</Card.Title>
                        </Col>
                      </Row>
                      <Row>
                          <Col xl={2}>
                              <p className="card-text">Hello:</p>
                              <p className="card-text">Fwd-Delay:</p>
                              <p className="card-text">Hold Count:</p>
                              <p className="card-text">Bridge Prio.:</p>
                              <p className="card-text">Bridge Add.:</p>
                              <p className="card-text">Des. Root Prio.:</p>
                              <p className="card-text">Des. Root Add.:</p>
                              <p className="card-text">Root Port:</p>
                              <p className="card-text">Root Cost:</p>
                              <p className="card-text">Hold Time:</p>
                              <p className="card-text">Topology Changes:</p>
                              <p className="card-text">Last Change:</p>
                          </Col>
                          <Col xl={2}>
                              <p className="card-text">{props.span['hello-time']}</p>
                              <p className="card-text">{props.span['forwarding-delay']}</p>
                              <p className="card-text">{props.span['hold-count']}</p>
                              <p className="card-text">{props.span['bridge-priority']}</p>
                              <p className="card-text">{props.span['bridge-address']}</p>
                              <p className="card-text">{props.span['designated-root-priority']}</p>
                              <p className="card-text">{props.span['designated-root-address']}</p>
                              <p className="card-text">{props.span['root-port']}</p>
                              <p className="card-text">{props.span['root-cost']}</p>
                              <p className="card-text">{props.span['hold-time']}</p>
                              <p className="card-text">{props.span['topology-changes']}</p>
                              <p className="card-text">{props.span['time-of-last-topology-change']}</p>
                          </Col>
                          <Col xl={8}>
                            {CreateCard(spanTable, "Ports")}
                          </Col>
                      </Row>
                  </Card.Body>
              </Card>
      }
      else {
        return <Col xl={8}>
                   {CreateCard(spanTable, "Ports")}
                </Col>
      }
                
  }
  