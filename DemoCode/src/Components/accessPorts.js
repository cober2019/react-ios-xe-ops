import React, { useState, useEffect } from 'react';
import { AccessTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function AccessPorts(props){
  const [chartStatus, setChartStatus] = useState(false)
  const accesssTableRef = React.createRef()
  const accessstable = AccessTableHtml(accesssTableRef)
  $.fn.dataTable.ext.errMode = 'none';


  useEffect(() => {
    $(accesssTableRef.current).DataTable().clear()
    $(accesssTableRef.current).DataTable().rows.add(Object.values(props.ports))
    $(accesssTableRef.current).DataTable().draw(false)
    }, [props.ports])


  useEffect(() => {
        $(accesssTableRef.current).DataTable().destroy()
        try{
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
            //Change Back to 'ready'
            if(aData['status'].includes('up')){
                $('td:eq(2)', nRow).addClass('env-row-text')
            }
            else{
              $('td:eq(2)', nRow).addClass('env-row-text-warn')
            }
            }})
        }
      catch{}
      setChartStatus(true)
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
  