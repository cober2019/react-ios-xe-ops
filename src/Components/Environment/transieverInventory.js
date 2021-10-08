import React, { useEffect } from 'react';
import { InventoryTransceiverTableHtml, TransceiverTableHtml } from '../Other/chartConfigs';
import { TransieverData, InvTransieverData } from '../Other/tables';

const $ = require('jquery');
$.DataTable = require('datatables.net');


export  function TransceiversInv(props){
  const inventoryTransceiverTableRef = React.createRef()
  const inventorytable = InventoryTransceiverTableHtml(inventoryTransceiverTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(inventoryTransceiverTableRef.current !== null){
      try{  
        $(inventoryTransceiverTableRef.current).DataTable().clear()
        $(inventoryTransceiverTableRef.current).DataTable().rows.add(props.transceivers)
        $(inventoryTransceiverTableRef.current).DataTable().draw(false)
      }
      catch{}
    }
    }, [props.transceivers])

  useEffect(() => {

        $(inventoryTransceiverTableRef.current).DataTable().destroy()
        InvTransieverData(inventoryTransceiverTableRef.current, props.transceivers)
       
  }, [])

  return  inventorytable
                
  }
  