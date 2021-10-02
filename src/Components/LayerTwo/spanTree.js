import React, { useEffect } from 'react';
import { SpanTreeHtml } from '../Other/chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function SpanTable(props){
  const spanTableRef = React.createRef()
  const spanTable = SpanTreeHtml(spanTableRef)
  $.fn.dataTable.ext.errMode = 'none';
  console.log(props.span)
  
  useEffect(() => {
    if(spanTableRef.current !== null){
      try{
        $(spanTableRef.current).DataTable().clear()
        $(spanTableRef.current).DataTable().rows.add(Object.values(props.macs))
        $(spanTableRef.current).DataTable().draw(false)
      }
      catch{}
    }

    }, [props.macs])


  useEffect(() => {
    try{
    $(spanTableRef.current).DataTable().destroy()
      $(spanTableRef.current).DataTable({
        data: props.span.interfaces.interface,
        language: {
          emptyTable: "No MAC Addresses Found"
        },
        columns:  [
          { data: 'name'},
          { data: 'cost'},
          { data: 'port-priority'},
          { data: 'role' },
          { data: 'state'},
          { data: 'forward-transitions' },
          { data: 'link-type' }
      ]
      });
    }
    catch{}

}, [])

  if(Object.keys(props.span).length !== 0){
    return    <div className="card bg-dark mt-3">
                  <div className="card-body">
                      <div className="row">
                          <div className="col-2">
                              <h4 class="card-title mb-3">{props.span.instance}</h4>
                              <p className="card-text">Hello:</p>
                              <p className="card-text">Fwd-Delay:</p>
                              <p className="card-text">Hold Count:</p>
                              <p className="card-text">Bridge Prio.:</p>
                              <p className="card-text">Bridge Add.:</p>
                              <p className="card-text">Des. Root Prio.:</p>
                              <p className="card-text">Des. Root Add.:</p>
                              <p className="card-text">Root Port:</p>
                              <p className="card-text">Root Cost:</p>
                              <p className="card-text">Hold Time:</p>
                              <p className="card-text">Topology Changes:</p>
                              <p className="card-text">Last Change:</p>
                          </div>
                          <div className="col-2">
                              <h4 class="card-title mb-5"> </h4>
                              <p className="card-text">{props.span['hello-time']}</p>
                              <p className="card-text">{props.span['forwarding-delay']}</p>
                              <p className="card-text">{props.span['hold-count']}</p>
                              <p className="card-text">{props.span['bridge-priority']}</p>
                              <p className="card-text">{props.span['bridge-address']}</p>
                              <p className="card-text">{props.span['designated-root-priority']}</p>
                              <p className="card-text">{props.span['designated-root-address']}</p>
                              <p className="card-text">{props.span['root-port']}</p>
                              <p className="card-text">{props.span['root-cost']}</p>
                              <p className="card-text">{props.span['hold-time']}</p>
                              <p className="card-text">{props.span['topology-changes']}</p>
                              <p className="card-text">{props.span['time-of-last-topology-change']}</p>
                          </div>
                          <div className="col-8">
                              <div className="card bg-dark border-0">
                                  <div className="card-body">
                                      <h4 class="card-title mb-3">Ports</h4>
                                      {spanTable}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
      }
      else {
        return <div className="col-8">
                  <div className="card bg-dark border-0">
                      <div className="card-body">
                          <h4 class="card-title mb-3">Ports</h4>
                          {spanTable}
                      </div>
                  </div>
              </div>
      }
                
  }
  