import React, { useEffect } from 'react';
import { PlusRibEntriesTableHtml, MinusRibEntriesTableHtml } from '../Other/chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function RibDiff(props){
  const ribDiffEntries = React.createRef()
  const plusEntriesTable = PlusRibEntriesTableHtml(ribDiffEntries)
  console.log(props.ribs)
  
  useEffect(() => {

    if(ribDiffEntries.current !== null){

      try{
        $(ribDiffEntries.current).DataTable().clear()
        $(ribDiffEntries.current).DataTable().rows.add(props.ribs)
        $(ribDiffEntries.current).DataTable().draw(false)
      }
      catch{}

    }
  
    }, [props.ribs])


  useEffect(() => {
        try{
            $(ribDiffEntries.current).DataTable().destroy()
            $(ribDiffEntries.current).DataTable({
              language: {
                emptyTable: "Rib Empty"
              },
              data: props.ribs,
              columns:  [
                { data: 'dest_prefix' },
                { data: 'next_hop' },
                { data: 'outgoing_interface' },
                { data: 'source_protocol' },
                { data: 'time' },
            ],
            fnRowCallback: function (nRow, aData) {
                try{
                    if(aData['status'] === 'green'){
                          $(nRow).addClass('env-row-text')
                        }
                    else if(aData['status'] === 'orange'){
                            $(nRow).addClass('env-row-text-warn')
                          }
                  }
                catch(e){console.log(e)}
              }});
          }

        catch(e){console.log(e)}

  }, [])


    return <div className="col-6">
                    <div className="card border-0 mb-3 bg-dark">
                        <div className="card-body">
                            <h4 class="card-title mb-3">Flapping Routes</h4>
                            {plusEntriesTable}
                            </div>
                        </div>
                    </div>
                       
  };
