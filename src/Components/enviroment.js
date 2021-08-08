import React, { useState, useEffect } from 'react';
import { EnvTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Envirmoment(props){
  const [chart, setChart] = useState(undefined)
  const [chartStatus, setChartStatus] = useState(false)
  const envTableRef = React.createRef()
  const table = EnvTableHtml(envTableRef)
  
  useEffect(() => {
      console.log(props.env)
    if(chartStatus !== true){
        $(envTableRef.current).DataTable().destroy()
          try{
            $(envTableRef.current).DataTable({
              dom: "",
              data: props.env['Cisco-IOS-XE-environment-oper:environment-sensors']['environment-sensor'],
              pageLength: 50,
              columns:  [
                { data: 'name' },
                { data: 'location' },
                { data: 'state' },
                { data: 'current-reading' },
                { data: 'sensor-units' }
            ],
            fnRowCallback: function (nRow, aData) {
                if(aData['state'] === 'Normal' ||  aData['state'] === 'GREEN'){
                    $('td:eq(2)', nRow).addClass('env-row-text')
                    $('td:eq(3)', nRow).addClass('env-row-text')
                }
                else if(aData['state'].includes('Fan')){
                  //pass
              }
                else if(aData['state'] !== 'Normal' || aData['state'] === 'GREEN'){
                  $('td:eq(2)', nRow).addClass('env-row-text-warn')
                  $('td:eq(3)', nRow).addClass('env-row-text-warn')
                }
                }});
          }
        catch{}

      setChart(chart)
      setChartStatus(true)
      }

  }, [props.env])

  return  <div className="card text-white bg-dark">
              <div className="card-body">
              <h4 class="card-title">Environment Stats</h4>
              {table}
              </div>
            </div>
  }
  