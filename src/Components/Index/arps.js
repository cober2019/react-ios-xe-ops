import React, { useEffect } from 'react';
import { ArpTableHtml } from '../Other/chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export  function Arps(props){
  const arpTableRef = React.createRef()
  const table = ArpTableHtml(arpTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(arpTableRef.current !== null){
      try{
        $(arpTableRef.current).DataTable().clear()
        $(arpTableRef.current).DataTable().rows.add(props.arps)
        $(arpTableRef.current).DataTable().draw(false)
      }
      catch{}
    }

  }, [props.arps])
  
  useEffect(() => {
    $(arpTableRef.current).DataTable().destroy()
    try{
        $(arpTableRef.current).DataTable({
          data: props.arps,
          language: {
            emptyTable: "No ARP Entries"
          },
          columns:  [
            { data: 'address' },
            { data: 'enctype' },
            { data: 'hardware' },
            { data: 'mode' },
            { data: 'time' },
            { data: 'type' },
            { data: 'vrf' }
        ]});
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
