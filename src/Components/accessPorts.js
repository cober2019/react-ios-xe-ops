import React, { useEffect } from 'react';
import { AccessTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function AccessPorts(props){
  const accesssTableRef = React.createRef()
  const accessstable = AccessTableHtml(accesssTableRef)
  $.fn.dataTable.ext.errMode = 'none';


  useEffect(() => {
    if(accesssTableRef.current !== null){
      try{
        $(accesssTableRef.current).DataTable().clear()
        $(accesssTableRef.current).DataTable().rows.add(Object.values(props.ports))
        $(accesssTableRef.current).DataTable().draw(false)
      }
      catch{}
    }
    }, [props.ports])


  useEffect(() => {
        $(accesssTableRef.current).DataTable().destroy()
        
          $(accesssTableRef.current).DataTable({
            data: props.ports,
            language: {
              emptyTable: "No Access Ports Assigned"
            },
            columns:  [
              { data: 'interface' },
              { data: 'vlan'},
              { data: 'status' },
              { data: 'mbpsOut' },
              { data: 'mbpsIn' }
          ],
          fnRowCallback: function (nRow, aData) {
            try{
            //Change Back to 'ready'
            if(aData['status'].includes('ready')){
                $('td:eq(2)', nRow).html('up')
                $('td:eq(2)', nRow).addClass('env-row-text')
            }
            else{
              $('td:eq(2)', nRow).html('down')
              $('td:eq(2)', nRow).addClass('env-row-text-warn')
            }
          }
            catch{}
        }
            });
  }, [])

  return  <div className="col-12">
            <div className="card text-white bg-dark mt-3">
              <div className="card-body">
              <h4 class="card-title mb-3">Access Ports</h4>
                {accessstable}
              </div>
            </div>
        </div>
  }
  