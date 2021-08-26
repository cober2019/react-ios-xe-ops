import React, { useState, useEffect } from 'react';
import { InterfacesTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function InterfaceTable(props){
  const [chartStatus, setChartStatus] = useState(false)
  const interfacesTableRef = React.createRef()
  const interfacestable = InterfacesTableHtml(interfacesTableRef)
  $.fn.dataTable.ext.errMode = 'none';
  
  useEffect(() => {
    $(interfacesTableRef.current).DataTable().clear()
    $(interfacesTableRef.current).DataTable().rows.add(Object.values(props.interfaces))
    $(interfacesTableRef.current).DataTable().draw(false)

    }, [props.interfaces])


  useEffect(() => {
    $(interfacesTableRef.current).DataTable().destroy()
    try{
      $(interfacesTableRef.current).DataTable({
        data: Object.values(props.interfaces),
        language: {
          emptyTable: "No Interfaces Found"
        },
        columns:  [
          { data: 'data.name'},
          { data: 'data.oper-status'},
          { data: 'data.description' },
          { data: 'data.ipv4' },
          { data: 'data.ipv4-subnet-mask'},
          { data: 'data.speed'},
	  { data: 'qos.allocation' },
          { data: 'data.statistics.tx-kbps'},
          { data: 'data.statistics.rx-kbps'},
	  { data: 'qos.direction' },
	  { data: 'qos.policy' }
	],
         
      fnRowCallback: function (nRow, aData) {
          
		try{
            
              let data = Object.values(props.interfaces)
              data.map(value => {
                  if(value.qos.length > 1 && value.interface === aData['data']['name']){
                    $('td:eq(6)', nRow).html('Mult. Allocations. See Qos Tab')
                  }
              })
	      if(aData['data']['oper-status'] !== 'down'){
              if(parseInt(aData['data']['statistics']['tx-kbps']) > parseInt(aData['qos']['allocation']) ){
                  $(nRow).addClass('env-row-text-warn blinking')
                  }
              else if(parseInt(aData['data']['statistics']['tx-kbps']) <= parseInt(aData['qos']['allocation']) ){
                  $('td:eq(6)', nRow).addClass('env-row-text')
                  }

              $('td:eq(5)', nRow).html(Math.round(aData['data']['speed'] / 1000000000) * 1000 )
              $('td:eq(5)', nRow).addClass()
              
            }
}
          catch(e){
            console.log(e)
          }      
      
      }});

    }
  catch{}
  setChartStatus(true)

}, [])

  return  <div className="col-12">
            <div className="card bg-dark">
                <div className="card-body">
                <h4 class="card-title mb-3">Interfaces</h4>
                  {interfacestable}
                </div>
              </div>
            </div>
  }
    