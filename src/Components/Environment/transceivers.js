import React, { useEffect } from 'react';
import { TransceiverTableHtml } from '../Other/chartConfigs';
import { TransieverData } from '../Other/tables';

const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Transceivers(props){
  const transceiverTableRef = React.createRef()
  const transceiverOpertable = TransceiverTableHtml(transceiverTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(transceiverTableRef.current !== null){
      try{  
        $(transceiverTableRef.current).DataTable().clear()
        $(transceiverTableRef.current).DataTable().rows.add(props.transceivers)
        $(transceiverTableRef.current).DataTable().draw(false)
      }
      catch{}
    }
    }, [props.transceivers])

  useEffect(() => {

        $(transceiverTableRef.current).DataTable().destroy()
        TransieverData(transceiverTableRef.current, props.transceivers)

  }, [])

  return  transceiverOpertable
               
  }
  