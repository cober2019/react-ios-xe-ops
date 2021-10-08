import React, { useEffect } from 'react';
import { PoeTableHtml } from '../Other/chartConfigs';
import { PoeData } from '../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function PoeConnections(props){
  const poeTableRef = React.createRef()
  const poeTable = PoeTableHtml(poeTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(poeTableRef.current !== null){
      try{  
        $(poeTableRef.current).DataTable().clear()
        $(poeTableRef.current).DataTable().rows.add(Object.values(props.poeprops.poe))
        $(poeTableRef.current).DataTable().rows.add(Object.values(props.poe))
        $(poeTableRef.current).DataTable().draw(false)
      }
      catch{}
    }
    }, [props.poe])

  useEffect(() => {
    $(poeTableRef.current).DataTable().destroy()
    PoeData(poeTableRef.current, props.poe)
  }, [])

  return poeTable
            
  }
  