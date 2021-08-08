import React, { useState, useEffect } from 'react';
import { CdpTableHtml, LldpTableHtml } from './chartConfigs';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function DpNeighbors(props){
  const [chart, setChart] = useState(undefined)
  const [chartStatus, setChartStatus] = useState(false)
  const cdpTableRef = React.createRef()
  const cdptable = CdpTableHtml(cdpTableRef)
  const lldpTableRef = React.createRef()
  const lldptable = LldpTableHtml(lldpTableRef)

  useEffect(() => {
    console.log(props.dp)
    if(chartStatus !== true){
        $(cdpTableRef.current).DataTable().destroy()
          try{
            $(cdpTableRef.current).DataTable({
              dom: "",
              data: props.dpNeighbors[0]['Cisco-IOS-XE-cdp-oper:cdp-neighbor-details']['cdp-neighbor-detail'],
              pageLength: 50,
              columns:  [
                { data: 'device-name' },
                { data: 'platform-name' },
                { data: 'version' },
                { data: 'port-id' },
                { data: 'duplex' },
                { data: 'capability' },
                { data: 'mgmt-address' },
                { data: 'ip-address' },
                { data: 'local-intf-name' }
            ]});
          }
        catch{}

        $(lldpTableRef.current).DataTable().destroy()
          try{
            $(lldpTableRef.current).DataTable({
              dom: "",
              data: props.dpNeighbors[1]['Cisco-IOS-XE-lldp-oper:lldp-entries']['lldp-entry'],
              pageLength: 50,
              columns:  [
                { data: 'device-id' },
                { data: 'local-interface' },
                { data: 'ttl' },
                { data: 'connecting-interface' }
            ]});
          }
        catch{}

      setChart(chart)
      setChartStatus(true)
      }

  }, [props.dp])

  return   <div className="col-12">
                <div className="card text-white bg-dark mt-3">
                    <div className="card-body">
                        <h4 class="card-title mb-3" >Neighbors</h4>
                        <ul class="nav">
                            <li class="nav-item">
                                <a href="#cdp" class="nav-link show active text-light" data-toggle="tab">CDP</a>
                            </li>
                            <li class="nav-item">
                                <a href="#lldp" class="nav-link text-light" data-toggle="tab">LLDP</a>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane fade in active" id="cdp" role="tabpanel">
                                {cdptable}
                            </div>
                            <div class="tab-pane fade" id="lldp" role="tabpanel">
                                {lldptable}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
  }
  