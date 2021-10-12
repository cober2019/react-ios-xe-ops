import React, { useEffect } from 'react';
import { MacTableHtml } from '../../Other/chartConfigs';
import { MacAddressData } from '../../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function MacTable(props){
  const macTableRef = React.createRef()
  const macTable = MacTableHtml(macTableRef)
  
  MacAddressData(macTableRef.current, props.macs)

  return  macTable

  }
  