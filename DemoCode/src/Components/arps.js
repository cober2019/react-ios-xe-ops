import React, { useState, useEffect } from 'react';
import { ArpTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export  function Arps(props){
  const [chartStatus, setChartStatus] = useState(false)
  const arpTableRef = React.createRef()
  const table = ArpTableHtml(arpTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    console.log(props.arps)
    try{
        $(arpTableRef.current).DataTable().clear()
        $(arpTableRef.current).DataTable().rows.add(props.arps)
        $(arpTableRef.current).DataTable().draw(false)
      }
      catch(e){
        console.log(e)}
  }, [props.arps])
  
  useEffect(() => {
    console.log(props.arps)
    try{
        $(arpTableRef.current).DataTable({
          data: props.arps,
          language: {
            emptyTable: "No ARP Entries"
          },
          columns:  [
            { data: 'address' },
            { data: 'hardware' },
            { data: 'mode' },
            { data: 'type' },
            { data: 'time' },
            { data: 'vrf' }
        ]});
        setChartStatus(true)
      }
    catch{}
  }, [])

  return <div className="col-xl-12">
            <div className="card text-white bg-dark mt-3 border-0">
                <div className="card-body">
                      {table}
                </div>
            </div>
        </div>
  }
  