import React, { useState, useEffect } from 'react';
import { AccessTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function AccessPorts(props){
  const [chartStatus, setChartStatus] = useState(false)
  const accesssTableRef = React.createRef()
  const accessstable = AccessTableHtml(accesssTableRef)


  useEffect(() => {
    $(accesssTableRef.current).DataTable().clear()
    $(accesssTableRef.current).DataTable().rows.add(Object.values(props.ports))
    $(accesssTableRef.current).DataTable().draw(false)
    }, [props.ports])


  useEffect(() => {
        $(accesssTableRef.current).DataTable().destroy()
        try{
          $(accesssTableRef.current).DataTable({
            pageLength: 50,
            data: props.ports,
            columns:  [
              { data: 'interface' },
              { data: 'vlan'},
              { data: 'status' },
              { data: 'mbpsOut' },
              { data: 'mbpsIn' }
          ],
          fnRowCallback: function (nRow, aData) {
            if(aData['status'].includes('ready')){
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
              <h4 class="card-title">Access Ports</h4>
                {accessstable}
              </div>
            </div>
        </div>
  }
  