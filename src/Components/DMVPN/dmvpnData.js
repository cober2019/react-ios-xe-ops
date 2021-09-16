import React, { useEffect, useRef} from 'react';
import { DmvpnTableHtml } from '../Other/chartConfigs';
import { DmvpnTopologyBuild, UpdateDmvpnTopology } from './topology';
const $ = require('jquery');
$.DataTable = require('datatables.net');

export  function DmvpnData(props){
  const dmvpnTopologyRef = React.createRef();
  const dmvpnTableRef = React.createRef();
  const dmvpnTopology = useRef(null);
  const dmvpnTable = DmvpnTableHtml(dmvpnTableRef);
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
        dmvpnTopology.current = UpdateDmvpnTopology(dmvpnTopologyRef.current, props.dmvpn)
        dmvpnTopologyRef.current =  dmvpnTopology.current
      }
      catch{}
    }
    }, [props.dmvpn])


  useEffect(() => {

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
            dmvpnTopology.current = DmvpnTopologyBuild(dmvpnTopologyRef.current, props.dmvpn, props.localIp)
            dmvpnTopologyRef.current =  dmvpnTopology.current
          }
        }
        catch{}

    }, [])

if(props.dmvpn.length !== 0){
    return <div>
            <div className="row">
              <div className="col-12">
                  <div className="card text-white bg-dark ">
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
  