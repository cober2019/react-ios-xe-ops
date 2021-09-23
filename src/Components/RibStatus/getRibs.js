import React, { useState, useEffect } from 'react';
import { Ipv4RibTableHtml, Ipv6RibTableHtml } from '../Other/chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function RibInfo(props){
  const ipv4RibTableRef = React.createRef()
  const ipv6RibTableRef = React.createRef()
  const ipv4IntTable = Ipv4RibTableHtml(ipv4RibTableRef)
  const ipv6IntTable = Ipv6RibTableHtml(ipv6RibTableRef)
  $.fn.dataTable.ext.errMode = 'none';
  
  useEffect(() => {

    if(ipv4RibTableRef.current !== null){
        $(ipv4RibTableRef.current).DataTable().clear()
        $(ipv4RibTableRef.current).DataTable().rows.add(props.routes['ietf-routing:ipv4'])
        $(ipv4RibTableRef.current).DataTable().draw(false)

        $(ipv6RibTableRef.current).DataTable().clear()
        $(ipv6RibTableRef.current).DataTable().rows.add(props.routes['ietf-routing:ipv6'])
        $(ipv6RibTableRef.current).DataTable().draw(false)
    }
  
    }, [props.routes])


  useEffect(() => {
    $(ipv4RibTableRef.current).DataTable().destroy()
        try{
            $(ipv4RibTableRef.current).DataTable({
              language: {
                emptyTable: "Rib Empty"
              },
              data: props.routes['ietf-routing:ipv4'],
              columns:  [
                { data: 'name' },
                { data: 'address_family' },
                { data: 'dest_prefix' },
                { data: 'metric' },
                { data: 'route_preference' },
                { data: 'next_hop' },
                { data: 'outgoing_interface'},
                { data: 'active' },
                { data: 'source_protocol' } 
            ]});
          }

        catch(e){console.log(e)}

        $(ipv6RibTableRef.current).DataTable().destroy()
        try{
            $(ipv6RibTableRef.current).DataTable({
              language: {
                emptyTable: "Rib Empty"
              },
              data: props.routes['ietf-routing:ipv6'],
              columns:  [
                { data: 'name' },
                { data: 'address_family' },
                { data: 'dest_prefix' },
                { data: 'metric' },
                { data: 'route_preference' },
                { data: 'next_hop' },
                { data: 'outgoing_interface'},
                { data: 'active' },
                { data: 'source_protocol' }
            ]});
          }

        catch{}
  }, [])


    return (
        <div className="card border-0 mt-3 mb-3 bg-dark">
            <div className="card-body">
                <div className="row">
                    <ul class="nav">
                        <li class="nav-item">
                            <a href="#ipv4" class="nav-link show active text-light" data-toggle="tab">IPv4 Entries</a>
                        </li>
                        <li class="nav-item">
                            <a href="#ipv6" class="nav-link  text-light" data-toggle="tab">IPv6 Entries</a>
                        </li>
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane show active" id="ipv4" role="tabpanel">
                            <div class="card  bg-dark ">
                            <div class="card-header border-0">
                                <div class="row align-items-center">
                                    <div class="col">
                                        <h4>IPv4 Entries</h4>
                                    </div>
                                </div>
                            </div>
                          {ipv4IntTable}
                        </div>
                      </div>
                      <div class="tab-pane" id="ipv6" role="tabpanel">
                        <div class="card  bg-dark  mb-3">
                          <div class="card-header border-0">
                              <div class="row align-items-center">
                                  <div class="col">
                                      <h4>IPv6 Entries</h4>
                                  </div>
                              </div>
                        </div>
                      {ipv6IntTable}
                    </div>
                </div>
                </div>    
            </div>
        </div>
    </div>
    );
  };
