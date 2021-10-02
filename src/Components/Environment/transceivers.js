import React, { useEffect } from 'react';
import { InventoryTransceiverTableHtml, TransceiverTableHtml } from '../Other/chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export  function Transceivers(props){
  const transceiverTableRef = React.createRef()
  const inventoryTransceiverTableRef = React.createRef()
  const transceiverOpertable = TransceiverTableHtml(transceiverTableRef)
  const inventorytable = InventoryTransceiverTableHtml(inventoryTransceiverTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(transceiverTableRef.current !== null){
      try{  
        $(transceiverTableRef.current).DataTable().clear()
        $(transceiverTableRef.current).DataTable().rows.add(props.transceivers)
        $(transceiverTableRef.current).DataTable().draw(false)
      }
      catch{}
      try{  
        $(inventoryTransceiverTableRef.current).DataTable().clear()
        $(inventoryTransceiverTableRef.current).DataTable().rows.add(props.transceivers)
        $(inventoryTransceiverTableRef.current).DataTable().draw(false)
      }
      catch{}
    }
    }, [props.transceivers])

  useEffect(() => {
    try{
        $(inventoryTransceiverTableRef.current).DataTable().destroy()
            $(inventoryTransceiverTableRef.current).DataTable({
            language: {
                emptyTable: "No Environment Detected"
            },
            data: props.transceivers,
            columns:  [
                { data: 'name' },
                { data: 'serial-no' },
                { data: 'connector' },
                { data: 'vendor' },
            ],
            fnRowCallback: function (nRow, aData) {
              try{
                $('td:eq(2)', nRow).html(aData['connector'].replace('connector', ' '))
              }
              catch{}
            }
            });
        }
        catch{}
    try{
        $(transceiverTableRef.current).DataTable().destroy()
            $(transceiverTableRef.current).DataTable({
            language: {
                emptyTable: "No Environment Detected"
            },
            data: props.transceivers,
            columns:  [
                { data: 'name' },
                { data: 'fault-condition' },
                { data: 'internal-temp' },
                { data: 'connector' },
                { data: 'ethernet-pmd' },
                { data: 'output-power.instant' },
                { data: 'input-power.instant' },
                { data: 'laser-bias-current.instant' },
            ],
            fnRowCallback: function (nRow, aData) {
    
              try{
                $('td:eq(3)', nRow).html(aData['connector'].replace('connector', ' '))
                $('td:eq(4)', nRow).html(aData['ethernet-pmd'].replace('SFP', ' '))
                if(aData['fault-condition'] === false){
                    $('td:eq(1)', nRow).addClass('env-row-text')
                }
                else if(aData['fault-condition'] === 'true'){
                    $(nRow).addClass('env-row-text-warn blinking')
                }
              }
              catch{}
            }
            });
        }
        catch{}
  }, [])

  return  <div className='row'>
            <div className='col-8'>
                <div className="card bg-dark mt-3">
                    <div className="card-body">
                        <h4 class="card-title mb-3">SFP Statuses</h4>
                        {transceiverOpertable}
                    </div>
                </div> 
            </div>
            <div className='col-4'>
                <div className="card bg-dark mt-3">
                    <div className="card-body">
                    <h4 class="card-title mb-3">SFP Inventory</h4>
                        {inventorytable}
                    </div>
                </div>
            </div>
        </div>
  }
  