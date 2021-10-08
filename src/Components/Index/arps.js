import React, { useEffect } from 'react';
import { ArpTableHtml } from '../Other/chartConfigs';
import { ArpData } from '../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export  function Arps(props){
  const arpTableRef = React.createRef()
  const table = ArpTableHtml(arpTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(arpTableRef.current !== null){
      try{
        $(arpTableRef.current).DataTable().clear()
        $(arpTableRef.current).DataTable().rows.add(props.arps)
        $(arpTableRef.current).DataTable().draw(false)
      }
      catch{}
    }

  }, [props.arps])
  
  useEffect(() => {
    $(arpTableRef.current).DataTable().destroy()
    ArpData(arpTableRef.current, props.arps)
  
  }, [])

  return table
  
  }
