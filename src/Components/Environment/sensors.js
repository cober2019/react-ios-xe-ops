import React, { useEffect } from 'react';
import { EnvTableHtml } from '../Other/chartConfigs';
import { SensorData } from '../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Sensors(props){
  const envTableRef = React.createRef()
  const table = EnvTableHtml(envTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  
  useEffect(() => {
    if(envTableRef.current !== null){
      try{  
        $(envTableRef.current).DataTable().clear()
        $(envTableRef.current).DataTable().rows.add(Object.values(props.env))
        $(envTableRef.current).DataTable().draw(false)
      }
      catch{}
    }
    }, [props.env])

  useEffect(() => {
    $(envTableRef.current).DataTable().destroy()
    SensorData(envTableRef.current, props.env)
       
  }, [])

  return table
             
  }
  