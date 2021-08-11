import React, { useState, useEffect } from 'react';
import { TrunkTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Trunks(props){
  const [chart, setChart] = useState(undefined)
  const [chartStatus, setChartStatus] = useState(false)
  const trunksTableRef = React.createRef()
  const trunkstable = TrunkTableHtml(trunksTableRef)

  useEffect(() => {
        $(trunksTableRef.current).DataTable().destroy()
        try{
          $(trunksTableRef.current).DataTable({
            dom: "",
            data: props.ports,
            columns:  [
              { data: 'interface' },
              { data: 'vlans' },
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
            }});
        }
      catch{}
      setChartStatus(true)

  }, [props.ports])

  return  <div className="col-12">
          <div className="card text-white bg-dark">
                <div className="card-body">
                <h4 class="card-title">Trunks</h4>
                  {trunkstable}
                </div>
              </div>
              </div>
  }
  