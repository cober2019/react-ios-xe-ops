import React, { useEffect } from 'react';
import { SlaTableHtml } from '../../Other/chartConfigs';
import { IpSlaData } from '../../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function SlaStats(props){
  const slaTableRef = React.createRef()
  const slaTable = SlaTableHtml(slaTableRef)


  IpSlaData(slaTableRef.current, props.slas)
       
  return slaTable
              
  }
  