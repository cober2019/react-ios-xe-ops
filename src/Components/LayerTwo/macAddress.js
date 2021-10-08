import React, { useEffect } from 'react';
import { MacTableHtml } from '../Other/chartConfigs';
import { MacAddressData } from '../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function MacTable(props){
  const macTableRef = React.createRef()
  const macTable = MacTableHtml(macTableRef)
  $.fn.dataTable.ext.errMode = 'none';
  console.log(props.macs)
  
  useEffect(() => {
    if(macTableRef.current !== null){
      try{
        $(macTableRef.current).DataTable().clear()
        $(macTableRef.current).DataTable().rows.add(Object.values(props.macs))
        $(macTableRef.current).DataTable().draw(false)
      }
      catch{}
    }

    }, [props.macs])


  useEffect(() => {
    $(macTableRef.current).DataTable().destroy()
    MacAddressData(macTableRef.current, props.macs)
}, [])

  return  macTable

  }
  