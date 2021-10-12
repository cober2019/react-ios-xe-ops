import React, { useEffect } from 'react';
import { VlanTableHtml } from '../../Other/chartConfigs';
import { VlanData } from '../../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Vlans(props){
  const vlanTableRef = React.createRef()
  const vlantable = VlanTableHtml(vlanTableRef)


  VlanData(vlanTableRef.current, props.vlans)


  return  vlantable

  }
  