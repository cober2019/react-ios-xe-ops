import React, { useEffect } from 'react';
import { PoeTableHtml } from '../Other/chartConfigs';
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

    try{
        $(poeTableRef.current).DataTable().destroy()
            $(poeTableRef.current).DataTable({
            language: {
                emptyTable: "No PoE Ports"
            },
            data: props.poe,
            columns:  [
                { data: 'intf-name' },
                { data: 'poe-intf-enabled' },
                { data: 'power-used' },
                { data: 'pd-class' },
            ]
            });
        }
        catch{}
  }, [])

  return  <div className="card text-white mt-3 bg-dark">
              <div className="card-body">
              <h4 class="card-title mb-3">POE Interfaces</h4>
                {poeTable}
              </div>
            </div>
  }
  