import React, { useEffect } from 'react';
import { MacTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function MacTable(props){
  const macTableRef = React.createRef()
  const macTable = MacTableHtml(macTableRef)
  $.fn.dataTable.ext.errMode = 'none';
  console.log(props.macs)
  
  useEffect(() => {
    if(macTableRef.current !== null){
      try{
        $(macTableRef.current).DataTable().clear()
        $(macTableRef.current).DataTable().rows.add(Object.values(props.macs))
        $(macTableRef.current).DataTable().draw(false)
      }
      catch{}
    }

    }, [props.macs])


  useEffect(() => {
    $(macTableRef.current).DataTable().destroy()
      $(macTableRef.current).DataTable({
        data: props.macs,
        language: {
          emptyTable: "No MAC Addresses Found"
        },
        columns:  [
          { data: 'vlan-id-number'},
          { data: 'mac'},
          { data: 'mat-addr-type' },
          { data: 'port' }
      ]
      });
}, [])

  return  <div className="col-12">
            <div className="card  bg-dark mt-3">
                <div className="card-body">
                <h4 class="card-title mb-3">Mac-Addresses</h4>
                  {macTable}
                </div>
              </div>
            </div>
  }
  