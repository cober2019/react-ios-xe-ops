import React, { useEffect } from 'react';
import { CdpTableHtml, LldpTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function DpNeighbors(props){
  const cdpTableRef = React.createRef()
  const cdptable = CdpTableHtml(cdpTableRef)
  const lldpTableRef = React.createRef()
  const lldptable = LldpTableHtml(lldpTableRef)
  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(cdpTableRef.current !== null){
      try{
        $(cdptable.current).DataTable().clear()
        $(cdptable.current).DataTable().rows.add(props.dpNeighbors[0]['Cisco-IOS-XE-cdp-oper:cdp-neighbor-details']['cdp-neighbor-detail'])
        $(cdptable.current).DataTable().draw(false)
      }
      catch{}
    }

    
    if(lldpTableRef.current !== null){
      try{
        $(lldpTableRef.current).DataTable().clear()
        $(lldpTableRef.current).DataTable().rows.add(props.dpNeighbors[1]['Cisco-IOS-XE-lldp-oper:lldp-entries']['lldp-entry'])
        $(lldpTableRef.current).DataTable().draw(false)
      }
      catch{}
    }
    }, [props.dp])

  useEffect(() => {
        try{
          $(cdpTableRef.current).DataTable({
            dom: "",
            language: {
              emptyTable: "No CDP Neighbors"
            },
            data: props.dpNeighbors[0]['Cisco-IOS-XE-cdp-oper:cdp-neighbor-details']['cdp-neighbor-detail'],
            columns:  [
              { data: 'device-name' },
              { data: 'platform-name' },
              { data: 'port-id' },
              { data: 'duplex' },
              { data: 'capability' },
              { data: 'mgmt-address' },
              { data: 'ip-address' },
              { data: 'local-intf-name' }
          ],});
        }
      catch{}
      
      $(lldpTableRef.current).DataTable().destroy()
        try{
          $(lldpTableRef.current).DataTable({
            dom: "",
            language: {
              emptyTable: "No LLDP Neighbors"
            },
            data: props.dpNeighbors[1]['Cisco-IOS-XE-lldp-oper:lldp-entries']['lldp-entry'],
            columns:  [
              { data: 'device-id' },
              { data: 'local-interface' },
              { data: 'ttl' },
              { data: 'connecting-interface' }
          ]});
        }
      catch{}
      
  }, [])
    return   <div className="col-12">
                  <div className="card text-white bg-dark mb-3">
                      <div className="card-body">
                          <h4 class="card-title mb-3">DP Neighbors</h4>
                          <ul class="nav">
                              <li class="nav-item">
                                  <a href="#cdp" class="nav-link show active text-light" data-toggle="tab">CDP</a>
                              </li>
                              <li class="nav-item">
                                  <a href="#lldp" class="nav-link text-light" data-toggle="tab">LLDP</a>
                              </li>
                          </ul>
                          <div class="tab-content">
                              <div class="tab-pane show active" id="cdp" role="tabpanel">
                                  {cdptable}
                              </div>
                              <div class="tab-pane " id="lldp" role="tabpanel">
                                  {lldptable}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

  }
  