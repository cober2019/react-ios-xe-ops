import React, { useEffect } from 'react';
import { TrunkTableHtml } from '../Other/chartConfigs';
import { TrunkData } from '../Other/tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Trunks(props){
  const trunksTableRef = React.createRef()
  const trunkstable = TrunkTableHtml(trunksTableRef)
  console.log(props.ports, 'yes')

  useEffect(() => {
    if(trunksTableRef.current !== null){
      try{
        $(trunksTableRef.current).DataTable().clear()
        $(trunksTableRef.current).DataTable().rows.add(Object.values(props.ports))
        $(trunksTableRef.current).DataTable().draw(false)
      }
      catch{}
    }
    }, [props.ports])

  useEffect(() => {
        $(trunksTableRef.current).DataTable().destroy()
        TrunkData(trunksTableRef.current, props.ports)
  }, [])

  return  trunkstable

  }
  