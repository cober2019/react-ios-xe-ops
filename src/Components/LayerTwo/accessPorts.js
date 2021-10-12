import React, { useEffect } from 'react';
import { AccessTableHtml } from '../Other/chartConfigs';
import { AccesPortData } from '../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function AccessPorts(props){
  const accesssTableRef = React.createRef()
  const accessstable = AccessTableHtml(accesssTableRef)
  $.fn.dataTable.ext.errMode = 'none';


  useEffect(() => {
    if(accesssTableRef.current !== null){
      try{
        $(accesssTableRef.current).DataTable().clear()
        $(accesssTableRef.current).DataTable().rows.add(Object.values(props.ports))
        $(accesssTableRef.current).DataTable().draw(false)
      }
      catch{}
    }
    }, [props.ports])


  useEffect(() => {
        $(accesssTableRef.current).DataTable().destroy()
        AccesPortData(accesssTableRef.current, props.ports)
  }, [])

  return  accessstable
       
  }
  