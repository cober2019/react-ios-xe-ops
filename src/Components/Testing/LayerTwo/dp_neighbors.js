import React, { useEffect } from 'react';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { CdpTable, LldpTable } from './tables';
import { CdpTableHtml, LldpTableHtml } from '../../Other/chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export  function DpNeighbors(props){
  const cdpTableRef = React.createRef()
  const cdptable = CdpTableHtml(cdpTableRef)
  const lldpTableRef = React.createRef()
  const lldptable = LldpTableHtml(lldpTableRef)


    CdpTable(cdpTableRef.current, props.dpNeighbors[0])
    LldpTable(lldpTableRef.current, props.dpNeighbors[1])


  return  <Tabs defaultActiveKey="cdp" id="dpneighbors">
              <Tab eventKey="cdp" title="CDP">
                  {cdptable}
              </Tab>
              <Tab eventKey="lldp" title="LLDP">
                  {lldptable}
              </Tab>
            </Tabs>
            
            
      
  }
  