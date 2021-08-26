import React, { useState, useEffect } from 'react';
import { EnvTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Envirmoment(props){
  const [chart, setChart] = useState(undefined)
  const [chartStatus, setChartStatus] = useState(false)
  const envTableRef = React.createRef()
  const table = EnvTableHtml(envTableRef)
  $.fn.dataTable.ext.errMode = 'none';
  
  useEffect(() => {
    $(envTableRef.current).DataTable().clear()
    //$(envTableRef.current).DataTable().rows.add(Object.values(props.env['Cisco-IOS-XE-environment-oper:environment-sensors']['environment-sensor']))
    $(envTableRef.current).DataTable().rows.add(Object.values(props.env))
    $(envTableRef.current).DataTable().draw(false)
    }, [props.env])

  useEffect(() => {
    if(chartStatus !== true){
        $(envTableRef.current).DataTable().destroy()
          try{
            $(envTableRef.current).DataTable({
              language: {
                emptyTable: "No Environment Detected"
              },
              //props.env['Cisco-IOS-XE-environment-oper:environment-sensors']['environment-sensor']
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
                if(aData['current-reading'] < 20){
                    $('td:eq(2)', nRow).addClass('env-row-text')
                    $('td:eq(3)', nRow).addClass('env-row-text')
                }
                else if(aData['state'].includes('Fan')){
                  //pass
              }
                else if(aData['current-reading'] >= 20){
		  $('td:eq(0)', nRow).addClass('env-row-text-warn blinking')
		  $('td:eq(1)', nRow).addClass('env-row-text-warn blinking')		
                  $('td:eq(2)', nRow).addClass('env-row-text-warn blinking')
                  $('td:eq(3)', nRow).addClass('env-row-text-warn blinking')
		  $('td:eq(4)', nRow).addClass('env-row-text-warn blinking')
                  $('td:eq(2)', nRow).html('Warning')

                }
              }
              catch{}
            }
              });
          }
        catch{}

      setChart(chart)
      setChartStatus(true)
      }

  }, [])

  return  <div className="card text-white bg-dark">
              <div className="card-body">
              <h4 class="card-title mb-3">Environment Stats</h4>
              {table}
              </div>
            </div>
  }
  