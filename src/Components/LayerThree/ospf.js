import React, { useEffect } from 'react';
import { OpsfTableHtml, OpsfIntsTableHtml } from '../Other/chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function Ospf(props){
  const ospfTableRef = React.createRef()
  const ospfIntsTableRef = React.createRef()
  const ospfTable = OpsfTableHtml(ospfTableRef)
  const ospfIntTable = OpsfIntsTableHtml(ospfIntsTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(ospfTableRef.current !== null){
      try{
        $(ospfTableRef.current).DataTable().clear()
        $(ospfTableRef.current).DataTable().rows.add(Object.values(props.neighbors))
        $(ospfTableRef.current).DataTable().draw(false)
      }
      catch{}

      try{
        $(ospfIntsTableRef.current).DataTable().clear()
        $(ospfIntsTableRef.current).DataTable().rows.add(Object.values(props.interfaces))
        $(ospfIntsTableRef.current).DataTable().draw(false)
      }
      catch{}

    }
    }, [props.neighbors])

  useEffect(() => {
        $(ospfTableRef.current).DataTable().destroy()
          $(ospfTableRef.current).DataTable({
            data: props.neighbors
            ,language: {
              emptyTable: "No OSPF Neighbors"
            },
            columns:  [
              { data: 'neighbor-id' },
              { data: 'address' },
              { data: 'state' },
              { data: 'dr' },
              { data: 'bdr' },
          ],
          
          fnRowCallback: function (nRow, aData) {
              try{
    
                  if(aData['state'] === 'ospf-nbr-full' || aData['state'] === 'ospf-nbr-two-way'){
                      $('td:eq(2)', nRow).addClass('env-row-text')
                      }
                  else {
                      $(nRow).addClass('env-row-text-warn blinking')
                      }
                }
              catch(e){
                console.log(e)
              }
            }});

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
          ],
          fnRowCallback: function (nRow, aData) {
              try{
                  if(parseInt(aData['hello-timer']) === 0) {
                      $(nRow).addClass('env-row-text-warn blinking')
                  }
                  else if(parseInt(aData['hello-timer']) <= 4) {
                      $('td:eq(8)', nRow).addClass('env-row-text-warn')
                  }
                  else {
                      $('td:eq(8)', nRow).addClass('env-row-text')
                      }
                }
              catch(e){
                console.log(e)
              }
            }});
      }, [])
  
  if(props.neighbors.length !== 0){
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
  