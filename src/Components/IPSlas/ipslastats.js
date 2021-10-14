import React, { useEffect } from 'react';
import { SlaTableHtml } from '../Other/chartConfigs';
import { IpSlaData } from '../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function SlaStats(props){
  const slaTableRef = React.createRef()
  const slaTable = SlaTableHtml(slaTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  
  useEffect(() => {
    if(slaTableRef.current !== null){
      try{
        $(slaTableRef.current).DataTable().clear()
        $(slaTableRef.current).DataTable().rows.add(props.slas)
        $(slaTableRef.current).DataTable().draw(false)
      }
      catch{}
    }

    }, [props.slas])


  useEffect(() => {

        $(slaTableRef.current).DataTable().destroy()
        IpSlaData(slaTableRef.current, props.slas)
       
}, [])

  return slaTable
              
  }
  