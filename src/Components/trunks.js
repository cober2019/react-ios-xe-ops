import React, { useEffect } from 'react';
import { TrunkTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Trunks(props){
  const trunksTableRef = React.createRef()
  const trunkstable = TrunkTableHtml(trunksTableRef)

  useEffect(() => {
    if(trunksTableRef.current !== null){
      $(trunksTableRef.current).DataTable().clear()
      $(trunksTableRef.current).DataTable().rows.add(Object.values(props.ports))
      $(trunksTableRef.current).DataTable().draw(false)
    }
    }, [props.ports])

  useEffect(() => {
        $(trunksTableRef.current).DataTable().destroy()
          $(trunksTableRef.current).DataTable({
            data: props.ports
            ,language: {
              emptyTable: "No Trunks Configured"
            },
            columns:  [
              { data: 'interface' },
              { data: 'vlans' },
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
          }});

      }, [])

  return  <div className="col-12">
          <div className="card text-white bg-dark">
                <div className="card-body">
                <h4 class="card-title mb-3">Trunks</h4>
                  {trunkstable}
                </div>
              </div>
              </div>
  }
  