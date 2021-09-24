import React, { useEffect } from 'react';
import { SlaTableHtml } from '../Other/chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function SlaStats(props){
  const slaTableRef = React.createRef()
  const slaTable = SlaTableHtml(slaTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  console.log(props.slas)
  
  useEffect(() => {
    if(slaTableRef.current !== null){
      try{
        $(slaTableRef.current).DataTable().clear()
        $(slaTableRef.current).DataTable().rows.add(props.slas)
        $(slaTableRef.current).DataTable().draw(false)
      }
      catch{}
    }

    }, [props.slas])


  useEffect(() => {

    try{
        $(slaTableRef.current).DataTable().destroy()
        $(slaTableRef.current).DataTable({
            data: props.slas,
            language: {
            emptyTable: "No SLAs Found"
            },
            columns:  [
            { data: 'oper-id'},
            { data: 'latest-oper-start-time'},
            { data: 'oper-type'},
            { data: 'latest-return-code' },
            { data: 'success-count' },
            { data: 'failure-count' },
            { data: 'rtt-info.latest-rtt.rtt' },
            { data: 'rtt-info.latest-rtt.time-to-live' }
        ],
        fnRowCallback: function (nRow, aData) {
            try{
                if(aData['success-count']){
                      $('td:eq(4)', nRow).addClass('env-row-text')
                      }
                else if(parseInt(aData['failure-count']) > 0){
                      $('td:eq(4)', nRow).addClass('env-row-text-warn')
                }
                if(!aData['rtt-info.latest-rtt.time-to-live']){
                  $('td:eq(7)', nRow).html('forever')
                  }
              }
            catch(e){}
          }
        });
    }
    catch{}
}, [])

  return  <div className="col-12">
            <div className="card bg-dark mt-3">
                <div className="card-body">
                <h4 class="card-title mb-3">IP Slas</h4>
                  {slaTable}
                </div>
              </div>
            </div>
  }
  