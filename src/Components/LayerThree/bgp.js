import React, { useEffect, useRef } from 'react';
import { BgpTableHtml } from '../Other/chartConfigs';
import { BgpTopologyBuild, UpdateBgpTopology } from './topology';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Bgp(props){
  const bgpTableRef = React.createRef()
  const bgpTopologyRef = React.createRef()
  const bgpTopology = useRef(null)
  const bgpTable = BgpTableHtml(bgpTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(bgpTableRef.current !== null){
      try{
        $(bgpTableRef.current).DataTable().clear()
        $(bgpTableRef.current).DataTable().rows.add(Object.values(props.neighbors))
        $(bgpTableRef.current).DataTable().draw(false)
      }
      catch{}
      try{
        bgpTopology.current = UpdateBgpTopology(bgpTopologyRef.current, props.neighbors, props.details[2])
        bgpTopologyRef.current =  bgpTopology.current
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
              { data: 'remote-ip' },
              { data: 'remote-as' },
              { data: 'last-reset' },
              { data: 'state' },
              { data: 'received-prefixes' },
              { data: 'prefixes-sent' },
              { data: 'installed-prefixes' },
              { data: 'local-port' },
              { data: 'remote-port' },
          ],
          
          fnRowCallback: function (nRow, aData) {
              
              try{
                  if(aData['state'] === 'established'){
                    $('td:eq(2)', nRow).addClass('env-row-text')
                    $('td:eq(3)', nRow).addClass('env-row-text')
                    }
                  else {
                    $(nRow).addClass('env-row-text-warn blinking')
                  }
                }
              catch(e){
                console.log(e)
              }
            }
          });

          try{
            if(props.neighbors.length >= 1){
              bgpTopology.current = BgpTopologyBuild(bgpTopologyRef.current, props.neighbors, props.details[0], props.details[2], props.details[5], props.topology)
              bgpTopologyRef.current =  bgpTopology.current
            }
          }
          catch{}

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
                            <div className="row border-start border-success">
                              <div className="card text-white bg-dark ">
                                  <div className="card-body">
                                  <h4 class="card-title mb-3">BGP Neighbors</h4>
                                      {bgpTable}
                                  </div>
                              </div>
                            </div>
                          <div className="row">
                                <div ref={bgpTopologyRef} className="bg-dark border-start border-success" style={{width: '1500px', height: '300px'}}/>
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
  