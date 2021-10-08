import React, { useEffect } from 'react';
import { ProtocolsTableHtml } from '../Other/chartConfigs';
import { RoutingProtocolData } from '../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function RoutingProtocols(props){
  const routingProtocolsRef = React.createRef()
  const routingProtocolsTable = ProtocolsTableHtml(routingProtocolsRef)
  
  useEffect(() => {
      $(routingProtocolsRef.current).DataTable().destroy()
      RoutingProtocolData(routingProtocolsRef.current, props.protocols)
          
  }, [])

    return routingProtocolsTable
                         
 
  };
