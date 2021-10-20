import React, { useEffect } from 'react';
import { TrunkTableHtml } from '../../Other/chartConfigs';
import { TrunkData } from '../../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Trunks(props){
  const trunksTableRef = React.createRef()
  const trunkstable = TrunkTableHtml(trunksTableRef)


  
  TrunkData(trunksTableRef.current, props.ports)


  return  trunkstable

  }
  