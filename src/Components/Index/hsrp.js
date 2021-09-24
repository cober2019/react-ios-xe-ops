import React, { useEffect, useRef } from 'react';
import { HsrpTableHtml } from '../Other/chartConfigs';
import { HsrpTopologyBuild, UpdateHsrpTopology } from './topology';
const $ = require('jquery');
$.DataTable = require('datatables.net');


export  function Hsrp(props){
  const hsrpTableRef = React.createRef()
  const table = HsrpTableHtml(hsrpTableRef)
  const hsrpTopologyRef = React.createRef()
  const hsrpTopology = useRef(null)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(hsrpTableRef.current !== null){
      try{
        $(hsrpTableRef.current).DataTable().clear()
        $(hsrpTableRef.current).DataTable().rows.add(props.hsrp)
        $(hsrpTableRef.current).DataTable().draw(false)
      }
      catch{}
      try{
          hsrpTopology.current = UpdateHsrpTopology(hsrpTopology.current, props.hsrp, props.localIp)
          hsrpTopologyRef.current =  hsrpTopology.current
      }
      catch(e){console.log(e)}
    }

  }, [props.hsrp])
  
  useEffect(() => {
    $(hsrpTableRef.current).DataTable().destroy()
    try{
        $(hsrpTableRef.current).DataTable({
          data: props.hsrp,
          language: {
            emptyTable: "No HSRP Interfaces"
          },
          columns:  [
            { data: 'vlanInt' },
            { data: 'group' },
            { data: 'priority' },
            { data: 'state' },
            { data: 'standby' },
            { data: 'vip' }
        ],
          
        fnRowCallback: function (nRow, aData) {
            
            try{
                if(aData['state'] === 'Active'){
                  $('td:eq(3)', nRow).addClass('env-row-text')
                  $('td:eq(4)', nRow).addClass('env-row-text')
                }
              
                if(aData['standby'] === 'unknown' || aData['state'] === 'Init'){
                  $(nRow).addClass('env-row-text-warn blinking')
                }
              }
            catch(e){
              console.log(e)
            }
          }});
      }
    catch{}

    try{
      if(props.hsrp.length >= 1){
        hsrpTopology.current = HsrpTopologyBuild(hsrpTopologyRef.current, props.hsrp, props.localIp)
        hsrpTopologyRef.current =  hsrpTopology.current
      }
    }
    catch{}

  }, [])

  if(props.hsrp.length >= 1){
    return <div>
            <div className="row">
              <div className="col-12">
                  <div className="card text-white bg-dark ">
                      <div className="card-body">
                        <h4 class="card-title mb-3">HSRP Topology</h4>
                          <div className="col-12">
                            <div ref={hsrpTopologyRef} className="bg-dark" style={{width: '100%', height: '300px'}}/>
                          </div>
                          <div className="col-12">
                            <h4 class="card-title mb-3">HSRP Interfaces</h4>
                            {table}
                          </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
    }
    else{
      return <div>
              <div className="row">
                <div className="col-12">
                    <div className="card text-white bg-dark ">
                        <div className="card-body">
                            <div className="col-12">
                              <h4 class="card-title mb-3">HSRP Interfaces</h4>
                              {table}
                            </div>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
    }
              
  }
