import React, { useEffect } from 'react';
import { InterfacesTableHtml } from '../Other/chartConfigs';
import { InterfaceData } from '../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function InterfaceTable(props){
  const interfacesTableRef = React.createRef()
  const interfacestable = InterfacesTableHtml(interfacesTableRef)
  $.fn.dataTable.ext.errMode = 'none';
  
  useEffect(() => {
    if(interfacesTableRef.current !== null){
      try{
        $(interfacesTableRef.current).DataTable().clear()
        $(interfacesTableRef.current).DataTable().rows.add(Object.values(props.interfaces))
        $(interfacesTableRef.current).DataTable().draw(false)
      }
      catch{}
    }

    }, [props.interfaces])


  useEffect(() => {
    $(interfacesTableRef.current).DataTable().destroy()
    InterfaceData(interfacesTableRef.current, props.interfaces)
}, [])

  return interfacestable
                
  }
  