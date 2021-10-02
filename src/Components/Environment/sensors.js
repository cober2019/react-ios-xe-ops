import React, { useEffect } from 'react';
import { EnvTableHtml } from '../Other/chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Sensors(props){
  const envTableRef = React.createRef()
  const table = EnvTableHtml(envTableRef)
  $.fn.dataTable.ext.errMode = 'none';
  useEffect(() => {
    if(envTableRef.current !== null){
      try{  
        $(envTableRef.current).DataTable().clear()
        $(envTableRef.current).DataTable().rows.add(Object.values(props.env))
        $(envTableRef.current).DataTable().draw(false)
      }
      catch{}
    }
    }, [props.env])

  useEffect(() => {
    $(envTableRef.current).DataTable().destroy()
        $(envTableRef.current).DataTable({
          language: {
            emptyTable: "No Environment Detected"
          },
          data: props.env,
          columns:  [
            { data: 'name' },
            { data: 'location' },
            { data: 'state' },
            { data: 'current-reading' },
            { data: 'sensor-units' }
        ],
        fnRowCallback: function (nRow, aData) {

          try{
            if(aData['state'] === 'Normal' ||  aData['state'] === 'GREEN'){
                $('td:eq(2)', nRow).addClass('env-row-text')
                $('td:eq(3)', nRow).addClass('env-row-text')
            }
            else if(aData['state'].includes('Fan')){
              //pass
          }
            else if(aData['state'] !== 'Normal' || aData['state'] === 'GREEN'){
              $(nRow).addClass('env-row-text-warn')
              $(nRow).addClass('env-row-text-warn')
            }
          }
          catch{}
        }
          });
  }, [])

  return  <div className="card text-white bg-dark mt-3">
              <div className="card-body">
              <h4 class="card-title mb-3">Environment Stats</h4>
              {table}
              </div>
            </div>
  }
  