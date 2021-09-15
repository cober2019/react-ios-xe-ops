import React, { useEffect, useRef } from 'react';
import { OpsfTableHtml, OpsfIntsTableHtml } from '../Other/chartConfigs';
import { OspfTopologyBuild, UpdateOspfTopology } from './topology';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Ospf(props){
  const ospfTableRef = React.createRef()
  const ospfIntsTableRef = React.createRef()
  const ospfTopologyRef = React.createRef()
  const ospfTopology = useRef(null)
  const ospfTable = OpsfTableHtml(ospfTableRef)
  const ospfIntTable = OpsfIntsTableHtml(ospfIntsTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(ospfTableRef.current !== null){
    
      try{
        $(ospfIntsTableRef.current).DataTable().clear()
        $(ospfIntsTableRef.current).DataTable().rows.add(Object.values(props.interfaces))
        $(ospfIntsTableRef.current).DataTable().draw(false)
      }
      catch{}

      try{
        ospfTopology.current = UpdateOspfTopology(ospfTopology.current, props.neighbors, props.topology)
        ospfTopologyRef.current =  ospfTopology.current
      }
      catch(e){}
    }
    }, [props.neighbors])

  useEffect(() => {

        $(ospfIntsTableRef.current).DataTable().destroy()
          $(ospfIntsTableRef.current).DataTable({
            data: props.interfaces
            ,language: {
              emptyTable: "No OSPF Interfaces Found"
            },
            columns:  [
              { data: 'name' },
              { data: 'network-type' },
              { data: 'area' },
              { data: 'bdr' },
              { data: 'dr' },
              { data: 'cost' },
              { data: 'dead-interval' },
              { data: 'hello-interval' },
              { data: 'hello-timer' },
              { data: 'priority' },
              { data: 'neighbor-state.neighbor-id' },
              { data: 'neighbor-state.address' },
              { data: 'neighbor-state.state' },
              { data: 'neighbor-state.dr' },
              { data: 'neighbor-state.bdr' },
          ],
          fnRowCallback: function (nRow, aData) {
              try{
                  if(aData['neighbor-states']['state'] === 'ospf-nbr-full' || aData['neighbor-state']['state'] === 'ospf-nbr-two-way'){
                        $('td:eq(12)', nRow).addClass('env-row-text')
                        }
                  else {
                      $(nRow).addClass('env-row-text-warn blinking')
                  }
                }
              catch(e){
                console.log(e)
              }
            }});
          
          if(props.interfaces.length >= 1){
            ospfTopology.current = OspfTopologyBuild(ospfTopologyRef.current, props.neighbors, props.topology)
            ospfTopologyRef.current =  ospfTopology.current
          }

      }, [])
  
  if(props.interfaces.length !== 0){
    return <div>
              <div className="row">
                <div className="col-12">
                    <div className="card text-white bg-dark ">
                        <div className="card-body">
                          <h4 class="card-title mb-3">OSPF Interfaces</h4>
                          {ospfIntTable}
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <div ref={ospfTopologyRef} className="bg-dark border-top border-success" style={{width: '100%', height: '300px'}}/>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  }
  else{
    return  <div className="row">
                <div className="col-6">
                    <div className="card text-white bg-dark">
                        <div className="card-body">
                        <h4 class="card-title mb-3">OSPF Interfaces</h4>
                        {ospfIntTable}
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card text-white bg-dark ">
                        <div className="card-body">
                        <h4 class="card-title mb-3">OSPF Neighbors</h4>
                        {ospfTable}
                        </div>
                    </div>
                </div>
            </div>
  }
  }
  