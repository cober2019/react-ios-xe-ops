import React, { useEffect } from 'react';
import { BgpTableHtml, BgpDetailsTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Bgp(props){
  const bgpTableRef = React.createRef()
  const bgpTable = BgpTableHtml(bgpTableRef)
  $.fn.dataTable.ext.errMode = 'none';
  console.log(props.neighbors)

  useEffect(() => {
    if(bgpTableRef.current !== null){
      try{
        $(bgpTableRef.current).DataTable().clear()
        $(bgpTableRef.current).DataTable().rows.add(Object.values(props.neighbors))
        $(bgpTableRef.current).DataTable().draw(false)
      }
      catch{}
    }
    }, [props.neighbors])

  useEffect(() => {
        $(bgpTableRef.current).DataTable().destroy()
          $(bgpTableRef.current).DataTable({
            data: props.neighbors
            ,language: {
              emptyTable: "No BGP Neighbors"
            },
            columns:  [
              { data: 'id' },
              { data: 'bgp-version' },
              { data: 'messages-received' },
              { data: 'messages-sent' },
              { data: 'table-version' },
              { data: 'input-queue' },
              { data: 'output-queue' },
              { data: 'up-time' },
              { data: 'state' },
              { data: 'prefixes-received' },
              { data: 'dynamically-configured' },
              { data: 'as' },
          ],
          
          fnRowCallback: function (nRow, aData) {
              
              try{
                  if(aData['state'].includes('established')){
                    $('td:eq(8)', nRow).addClass('env-row-text')
                    $('td:eq(7)', nRow).addClass('env-row-text')
                    }
                  else {
                    $(nRow).addClass('env-row-text-warn blinking')
                  }
                }
              catch(e){
                console.log(e)
              }
            }});

      }, [])

  if(props.neighbors.length !== 0){
    return  <div className="row">
              <div className="card bg-dark mt-3">
                  <div className="card-body">
                      <div className="row">
                          <div className="col-2">
                              <h4 class="card-title mb-3">Local AS: {props.details[0]}</h4>
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-2">
                              <p className="card-text">Vrf-Name:</p>
                              <p className="card-text">Router-Id:</p>
                              <p className="card-text">BGP Table Ver.:</p>
                              <p className="card-text">Routing Table Ver.:</p>
                              <p className="card-text">Total Prefixes:</p>
                              <p className="card-text">Path Entries:</p>
                              <p className="card-text">AS Path Ent.</p>
                              <p className="card-text">Route-Map Ent.</p>
                              <p className="card-text">Filter-List Ent.:</p>
                              <p className="card-text">Total Memory:</p>
                          </div>
                          <div className="col-2">
                              <p className="card-text">{props.details[1]}</p>
                              <p className="card-text">{props.details[2]}</p>
                              <p className="card-text">{props.details[3]}</p>
                              <p className="card-text">{props.details[4]}</p>
                              <p className="card-text">{props.details[5]}</p>
                              <p className="card-text">{props.details[7]}</p>
                              <p className="card-text">{props.details[9]}</p>
                              <p className="card-text">{props.details[11]}</p>
                              <p className="card-text">{props.details[13]}</p>
                              <p className="card-text">{props.details[19]}</p>
                          </div>
                          <div className="col-8">
                              <div className="card text-white bg-dark ">
                                  <div className="card-body">
                                  <h4 class="card-title mb-3">BGP Neighbors</h4>
                                      {bgpTable}
                                  </div>
                              </div>
                          </div>
                          </div>
                      </div>
                  </div>
              </div>
  }
  else{
    return  <div className="card text-white bg-dark ">
            <div className="card-body">
            <h4 class="card-title mb-3">BGP Neighbors</h4>
                {bgpTable}
            </div>
        </div>
  }
            
  }
  