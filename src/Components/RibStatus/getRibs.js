import React, { useState, useEffect } from 'react';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import { Ipv4RibTableHtml, Ipv6RibTableHtml } from '../Other/chartConfigs';
import { Ipv4Ribs, Ipv6Ribs } from '../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function RibInfo(props){
  const ipv4RibTableRef = React.createRef()
  const ipv6RibTableRef = React.createRef()
  const ipv4IntTable = Ipv4RibTableHtml(ipv4RibTableRef)
  const ipv6IntTable = Ipv6RibTableHtml(ipv6RibTableRef)
  $.fn.dataTable.ext.errMode = 'none';
  
  useEffect(() => {

    if(ipv4RibTableRef.current !== null){
      try{
        $(ipv4RibTableRef.current).DataTable().clear()
        $(ipv4RibTableRef.current).DataTable().rows.add(props.routes['ietf-routing:ipv4'])
        $(ipv4RibTableRef.current).DataTable().draw(false)

        $(ipv6RibTableRef.current).DataTable().clear()
        $(ipv6RibTableRef.current).DataTable().rows.add(props.routes['ietf-routing:ipv6'])
        $(ipv6RibTableRef.current).DataTable().draw(false)
      }
      catch{}
    }
  
    }, [props.routes])


  useEffect(() => {
    $(ipv4RibTableRef.current).DataTable().destroy()
    Ipv4Ribs(ipv4RibTableRef.current, props.routes['ietf-routing:ipv4'])
    $(ipv6RibTableRef.current).DataTable().destroy()
    Ipv6Ribs(ipv6RibTableRef.current, props.routes['ietf-routing:ipv6'])

  }, [])

  return <Tabs defaultActiveKey="ipv4" id="uncontrolled-tab-example" className="mt-3 mb-3">
            <Tab eventKey="ipv4" title="IPv4">
                {ipv4IntTable}
            </Tab>
            <Tab eventKey="ipv6" title="IpV6">
              {ipv6IntTable}
            </Tab>
          </Tabs>
  
  };
