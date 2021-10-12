import React, { useEffect } from 'react';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { CdpTableHtml, LldpTableHtml } from './chartConfigs';
import { CdpTable, LldpTable } from './tables';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export  function DpNeighbors(props){
  const cdpTableRef = React.createRef()
  const cdptable = CdpTableHtml(cdpTableRef)
  const lldpTableRef = React.createRef()
  const lldptable = LldpTableHtml(lldpTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(cdpTableRef.current !== null){
      try{
        $(cdptable.current).DataTable().clear()
        $(cdptable.current).DataTable().rows.add(props.dpNeighbors[0])
        $(cdptable.current).DataTable().draw(false)
      }
      catch{}
    }

    
    if(lldpTableRef.current !== null){
      try{
        $(lldpTableRef.current).DataTable().clear()
        $(lldpTableRef.current).DataTable().rows.add(props.dpNeighbors[1])
        $(lldpTableRef.current).DataTable().draw(false)
      }
      catch{}
    }
    }, [props.dpNeighbors])

  useEffect(() => {
      $(lldpTableRef.current).DataTable().destroy() 
      $(cdptable.current).DataTable().destroy()
      CdpTable(cdpTableRef.current, props.dpNeighbors[0])
      LldpTable(lldpTableRef.current, props.dpNeighbors[1])
  }, [])

  return  <Tabs defaultActiveKey="cdp" id="dpneighbors">
                  <Tab eventKey="cdp" title="CDP">
                      {cdptable}
                  </Tab>
                  <Tab eventKey="lldp" title="LLDP">
                      {lldptable}
                  </Tab>
                </Tabs>
            
            
      
  }
  