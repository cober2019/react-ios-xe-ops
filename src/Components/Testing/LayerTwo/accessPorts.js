import React, { useEffect } from 'react';
import { AccessTableHtml } from '../../Other/chartConfigs';
import { AccesPortData } from '../../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function AccessPorts(props){
  const accesssTableRef = React.createRef()
  const accessstable = AccessTableHtml(accesssTableRef)



      AccesPortData(accesssTableRef.current, props.ports)


  return  accessstable
       
  }
  