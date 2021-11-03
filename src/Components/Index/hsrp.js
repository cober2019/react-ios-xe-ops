import React, { useEffect, useRef } from 'react';
import { HsrpTableHtml } from '../Other/chartConfigs';
import { HsrpData } from '../Other/tables';
import { HsrpTopologyBuild, UpdateHsrpTopology } from './topology';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export  function Hsrp(props){
  const hsrpTableRef = React.createRef()
  const table = HsrpTableHtml(hsrpTableRef)
  const hsrpTopologyRef = React.createRef()
  const hsrpTopology = useRef(null)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(hsrpTableRef.current !== null){
      try{
        $(hsrpTableRef.current).DataTable().clear()
        $(hsrpTableRef.current).DataTable().rows.add(props.hsrp)
        $(hsrpTableRef.current).DataTable().draw(false)
      }
      catch{}
      try{
          hsrpTopology.current = UpdateHsrpTopology(hsrpTopology.current, props.hsrp, props.localIp)
          hsrpTopologyRef.current =  hsrpTopology.current
      }
      catch{}
    }

  }, [props.hsrp])
  
  useEffect(() => {
    
    $(hsrpTableRef.current).DataTable().destroy()
    HsrpData(hsrpTableRef.current, props.hsrp)

    try{
      if(props.hsrp.length >= 1){
        hsrpTopology.current = HsrpTopologyBuild(hsrpTopologyRef.current, props.hsrp, props.localIp)
        hsrpTopologyRef.current =  hsrpTopology.current
      }
    }
    catch{}

  }, [])

    return <div>
                <div className="col-12">
                  <div ref={hsrpTopologyRef} className="bg-dark" style={{width: '100%', height: '300px'}}/>
                </div>
                <div className="col-12">
                  {table}
                </div>
              </div>
  }
