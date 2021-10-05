import React, { useEffect, useRef} from 'react';
import { DmvpnTableHtml, DmvpnInterfacesTableHtml, TunnelInterfacesTableHtml, DmvpnHubsTableHtml, NbmaLocationTableHtml } from '../Other/chartConfigs';
import { DmvpnTopologyBuild, UpdateDmvpnTopology } from './topology';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function DmvpnData(props){
  const dmvpnTopologyRef = React.createRef();
  const dmvpnTableRef = React.createRef();
  const dmvpnTopology = useRef(null);
  const dmvpnTable = DmvpnTableHtml(dmvpnTableRef);

  const dmvpnInterfacesTableRef = React.createRef()
  const dmvpnInterfacestable = DmvpnInterfacesTableHtml(dmvpnInterfacesTableRef)

  const tunnelInterfacesTableRef = React.createRef()
  const tunnelInterfacestable = TunnelInterfacesTableHtml(tunnelInterfacesTableRef)

  const dmvpnHubsTableRef = React.createRef()
  const dmvpnHubs = DmvpnHubsTableHtml(dmvpnHubsTableRef)

  const nbmaTableRef = React.createRef()
  const nmbaIps = NbmaLocationTableHtml(nbmaTableRef)

  $.fn.dataTable.ext.errMode = 'none';

  useEffect(() => {
    if(dmvpnTableRef.current !== null){
    
      try{
        $(dmvpnTableRef.current).DataTable().clear()
        $(dmvpnTableRef.current).DataTable().rows.add(Object.values(props.dmvpn))
        $(dmvpnTableRef.current).DataTable().draw(false)
      }
      catch{}
      try{
        $(tunnelInterfacesTableRef.current).DataTable().clear()
        $(tunnelInterfacesTableRef.current).DataTable().rows.add(Object.values(props.dmvpnInts[1]))
        $(tunnelInterfacesTableRef.current).DataTable().draw(false)
      }
      catch{}
      try{
        $(dmvpnInterfacesTableRef.current).DataTable().clear()
        $(dmvpnInterfacesTableRef.current).DataTable().rows.add(Object.values(props.dmvpnInts[2]))
        $(dmvpnInterfacesTableRef.current).DataTable().draw(false)
      }
      catch{}
      try{
        $(dmvpnHubsTableRef.current).DataTable().clear()
        $(dmvpnHubsTableRef.current).DataTable().rows.add(Object.values(props.hubs))
        $(dmvpnHubsTableRef.current).DataTable().draw(false)
      }
      catch{}
      try{
	if(props.locations.length !== 0){
        	$(nbmaTableRef.current).DataTable().clear()
        	$(nbmaTableRef.current).DataTable().rows.add(Object.values(props.locations))
        	$(nbmaTableRef.current).DataTable().draw(false)
	}
      }
      catch{}

      try{
        dmvpnTopology.current = UpdateDmvpnTopology(dmvpnTopologyRef.current, props.dmvpn)
        dmvpnTopologyRef.current =  dmvpnTopology.current
      }
      catch{}
    }
    }, [props.dmvpn])


  useEffect(() => {

    $(dmvpnHubsTableRef.current).DataTable().destroy()
    $(dmvpnHubsTableRef.current).DataTable({
        data: props.hubs
        ,language: {
            emptyTable: "No DMVPN Hubs Found"
        },
        columns:  [
            { data: 'hubNbma' },
            { data: 'tunnel' },
        ]
        }); 

    $(dmvpnTableRef.current).DataTable().destroy()
    $(dmvpnTableRef.current).DataTable({
        data: props.dmvpn
        ,language: {
            emptyTable: "No DMVPN Topology Found"
        },
        columns:  [
            { data: 'peerNbma' },
            { data: 'peerTunnel' },
            { data: 'state' },
            { data: 'upTime' },
            { data: 'attrb' },
        ]
        }); 
        
        try{
          if(props.dmvpn.length >= 1){
            dmvpnTopology.current = DmvpnTopologyBuild(dmvpnTopologyRef.current, props.dmvpn, props.localIp, props.hubs)
            dmvpnTopologyRef.current =  dmvpnTopology.current
          }
        }
        catch{}

        $(dmvpnInterfacesTableRef.current).DataTable().destroy()
        $(dmvpnInterfacesTableRef.current).DataTable({
        data: props.dmvpnInts[2]
        ,language: {
            emptyTable: "No DMVPN Topology Found"
        },
        columns:  [
            { data: 'name' },
            { data: 'source' },
            { data: 'mtu' },
            { data: 'mss' },
            { data: 'mode' },
            { data: 'authentication' },
            { data: 'holdtime' },
            { data: 'protection' },
            { data: 'network-id' }
        ]
        }); 

        $(nbmaTableRef.current).DataTable().destroy()
        $(nbmaTableRef.current).DataTable({
        data: props.locations
        ,language: {
            emptyTable: "You May Have Reached IPAPI Query Limits"
        },
        columns:  [
            { data: 'ip' },
            { data: 'country_code' },
            { data: 'city' },
            { data: 'continent_code' },
            { data: 'latitude' },
            { data: 'longitude' },
            { data: 'org' },
            { data: 'asn' },
            { data: 'timezone' },
        ]
        }); 

        try{
          $(tunnelInterfacesTableRef.current).DataTable().destroy()
            $(tunnelInterfacesTableRef.current).DataTable({
              data: props.dmvpnInts[1],
              language: {
                emptyTable: "No DMVPN Found"
              },
              columns:  [
                { data: 'name'},
                { data: 'oper-status'},
                { data: 'description' },
                { data: 'ipv4' },
                { data: 'ipv4-subnet-mask'},
                { data: 'speed' },
                { data: 'statistics.tx-kbps'},
                { data: 'statistics.rx-kbps'},
            ],
              
            fnRowCallback: function (nRow, aData) {
                
                try{
                    $('td:eq(5)', nRow).html(Math.round(aData['data']['speed'] / 1000000000) * 1000 )
                    $('td:eq(5)', nRow).addClass()
                  }
                catch(e){
                  console.log(e)
                }
            }});
          }
          catch{}

    }, [])

if(props.dmvpn.length !== 0){

    return <div>
                <div className="row">
                  <div className="col-12">
                      <div className="card text-white bg-dark mb-3 ">
                          <div className="card-body">
                            <div className="row">
                              <h4 class="card-title mb-3">DMVPN Peers</h4>
                                <div className="col-6">
                                  {dmvpnTable}
                              </div>
                            <div className="col-6">
                              <div ref={dmvpnTopologyRef} className="bg-dark border-start border-success" style={{width: '100%', height: '500px'}}/>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="card bg-dark mb-3">
                        <div className="card-body">
                        <h4 class="card-title mb-3">Tunnel Interfaces</h4>
                          {tunnelInterfacestable}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-8">
                        <div className="card bg-dark mb-3">
                          <div className="card-body">
                          <h4 class="card-title mb-3">DMVPN Interfaces</h4>
                            {dmvpnInterfacestable}
                          </div>
                        </div>
                      </div>
                    <div className="col-4">
                      <div className="card bg-dark mb-3">
                          <div className="card-body">
                          <h4 class="card-title mb-3">DMVPN Hubs</h4>
                            {dmvpnHubs}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                      <div className="card bg-dark mb-3">
                        <div className="card-body">
                        <h4 class="card-title mb-3">NBMA Assignments</h4>
                          {nmbaIps}
                        </div>
                      </div>
                    </div>
                    </div>
                    <div>               
                  </div>
                  </div>
                    
  }
else{
    return  <div className="row">
                <div className="col-12">
                    <div className="card text-white bg-dark">
                        <div className="card-body">
                        <h4 class="card-title mb-3">DMVPN Interfaces</h4>
                        {dmvpnTable}
                        </div>
                    </div>
                </div>
            </div>
  }

  }
  