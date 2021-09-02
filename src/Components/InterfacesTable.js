import React, { useEffect } from 'react';
import { InterfacesTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function InterfaceTable(props){
  const interfacesTableRef = React.createRef()
  const interfacestable = InterfacesTableHtml(interfacesTableRef)
  $.fn.dataTable.ext.errMode = 'none';
  
  useEffect(() => {
    if(interfacesTableRef.current !== null){
      try{
        $(interfacesTableRef.current).DataTable().clear()
        $(interfacesTableRef.current).DataTable().rows.add(Object.values(props.interfaces))
        $(interfacesTableRef.current).DataTable().draw(false)
      }
      catch{}
    }

    }, [props.interfaces])


  useEffect(() => {

    try{
      $(interfacesTableRef.current).DataTable().destroy()
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
            { data: 'qos.allocation'},
            { data: 'data.statistics.tx-kbps'},
            { data: 'data.statistics.rx-kbps'},
            { data: 'qos.interface_policy'},
            { data: 'qos.direction'}
        ],
          
        fnRowCallback: function (nRow, aData) {
            
            try{
              
                let data = Object.values(props.interfaces)
                data.map(value => {
                    if(value.qos.length > 1 && value.interface === aData['data']['name']){
                      $('td:eq(6)', nRow).html('Mult. Allocations. See Qos Tab')
                    }
                })

                if(parseInt(aData['data']['statistics']['tx-kbps']) > parseInt(aData['qos']['allocation']) ){
                    $(nRow).addClass('env-row-text-warn blinking')
                    }
                else if(parseInt(aData['data']['statistics']['tx-kbps']) < parseInt(aData['qos']['allocation']) ){
                    $('td:eq(6)', nRow).addClass('env-row-text')
                    }

                $('td:eq(5)', nRow).html(Math.round(aData['data']['speed'] / 1000000000) * 1000 )
                $('td:eq(5)', nRow).addClass()
                
              }
            catch(e){
              console.log(e)
            }
        }});
      }
      catch{}
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
  