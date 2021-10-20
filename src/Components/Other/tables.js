

const $ = require('jquery');
$.DataTable = require('datatables.net');

export function CdpTable(ref, data){

    try{
        $(ref).DataTable({
        language: {
            emptyTable: "No CDP Neighbors"
        },
        data: data,
        columns:  [
            { data: 'device-name' },
            { data: 'platform-name' },
            { data: 'port-id' },
            { data: 'duplex' },
            { data: 'capability' },
            { data: 'mgmt-address' },
            { data: 'ip-address' },
            { data: 'local-intf-name' }
        ],
    
        fnRowCallback: function (nRow, aData) {
            
            try{
                if(aData['duplex'] === 'cdp-full-duplex-mismatch'){
                    $(nRow).addClass('env-row-text-warn blinking')}
                
              }
            catch(e){
              console.log(e)
            }
          }});
    }
    catch{}

    return ref

}

export function LldpTable(ref, data){

    try{
        $(ref).DataTable({
            language: {
            emptyTable: "No LLDP Neighbors"
            },
            data: data,
            columns:  [
            { data: 'device-id' },
            { data: 'local-interface' },
            { data: 'ttl' },
            { data: 'connecting-interface' }
        ]});
        }
    catch{}

    return ref

}

export function InterfaceData(ref, data){

    try{
          $(ref).DataTable({
            data: Object.values(data),
            language: {
              emptyTable: "No Interfaces Found"
            },
            columns:  [
              { data: 'data.name'},
              { data: 'data.oper-status'},
              { data: 'data.description' },
              { data: 'data.ipv4' },
              { data: 'data.ipv4-subnet-mask'},
              { data: 'data.speed'},
              { data: 'qos.allocation'},
              { data: 'data.statistics.tx-kbps'},
              { data: 'data.statistics.rx-kbps'},
              { data: 'data.outbandwidthDiff'},
              { data: 'data.inbandwidthDiff'},
              { data: 'qos.interface_policy'},
          ],
            
          fnRowCallback: function (nRow, aData) {
              
              try{
                
                  Object.values(data).map(value => {
                      if(value.qos.length > 1 && value.interface === aData['data']['name']){
                        $('td:eq(6)', nRow).html('Mult. Allocations. See Qos Tab')
                      }
                      return ''
                  })
  
                  if(parseInt(aData['data']['statistics']['tx-kbps']) > parseInt(aData['qos']['allocation']) ){
                      $(nRow).addClass('env-row-text-warn blinking')
                      }
                  else if(parseInt(aData['data']['statistics']['tx-kbps']) < parseInt(aData['qos']['allocation']) ){
                      $('td:eq(6)', nRow).addClass('env-row-text')
                      }

                  $('td:eq(5)', nRow).html(Math.round(aData['data']['speed'] / 1000000000) * 1000 )
                  $('td:eq(5)', nRow).addClass()
                  
                }
              catch(e){console.log(e)}
          }});
        }
        catch{}

        return ref

}

export function ArpData(ref, data){

    try{
        $(ref).DataTable({
          data: data,
          language: {
            emptyTable: "No ARP Entries"
          },
          columns:  [
            { data: 'address' },
            { data: 'enctype' },
            { data: 'hardware' },
            { data: 'mode' },
            { data: 'time' },
            { data: 'type' },
            { data: 'vrf' },
            { data: 'interface' }
        ]});
      }
    catch{}

    return ref
}

export function HsrpData(ref, data){

    try{
        $(ref).DataTable({
          data: data,
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

    return ref

}

export function OspfData(ref, data){

    try{
        $(ref).DataTable({
            data: data
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
    }
    catch{}

    return ref

}


export function BgpData(ref, data){

    $(ref).DataTable({
      data: data
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
            if(aData['state'] !== 'established'){
                    $(nRow).addClass('env-row-text-warn blinking')}
            else {
              $('td:eq(2)', nRow).addClass('env-row-text')
              $('td:eq(3)', nRow).addClass('env-row-text')

            }
          }
        catch(e){
          console.log(e)
        }
      }
    });

    return ref

}

export function IpSlaData(ref, data){

    try{
        $(ref).DataTable().destroy()
        $(ref).DataTable({
            data: data,
            language: {
            emptyTable: "No SLAs Found"
            },
            columns:  [
            { data: 'oper-id'},
            { data: 'latest-oper-start-time'},
            { data: 'oper-type'},
            { data: 'latest-return-code' },
            { data: 'success-count' },
            { data: 'failure-count' },
            { data: 'rtt-info.latest-rtt.rtt' },
            { data: 'rtt-info.latest-rtt.time-to-live' }
        ],
        fnRowCallback: function (nRow, aData) {
            try{
                if(aData['success-count']){
                      $('td:eq(4)', nRow).addClass('env-row-text')
                      }
                else if(parseInt(aData['failure-count']) > 0){
                      $('td:eq(4)', nRow).addClass('env-row-text-warn')
                }
                if(!aData['rtt-info.latest-rtt.time-to-live']){
                  $('td:eq(7)', nRow).html('forever')
                  }
              }
            catch(e){}
          }
        });
    }
    catch{}

}

export function CpuProcessData(ref, data){

    try{
        $(ref).DataTable({
            data: data,
            language: {
                emptyTable: "No CPU Processes Found"
            },
            columns:  [
                { data: 'name' },
                { data: 'total-run-time' },
                { data: 'avg-run-time' },
                { data: 'five-seconds' },
                { data: 'one-minute' },
                { data: 'five-minutes' }
            ],
            
            fnRowCallback: function (nRow, aData) {
                try{
                    if(parseFloat(aData['five-seconds']) > 25 ){
                        $('td:eq(3)', nRow).addClass('env-row-text-warn')
                        }
                    if(parseFloat(aData['one-minute']) > 25 ){
                        $('td:eq(4)', nRow).addClass('env-row-text-warn')
                        }
                    if(parseFloat(aData['five-minutes']) > 25 ){
                        $('td:eq(5)', nRow).addClass('env-row-text-warn')
                        }
                    }
                catch{}
            }})
        }
        catch{}

}

export function MemoryData(ref, data){

    try{
        $(ref).DataTable().destroy()
        $(ref).DataTable({
            language: {
                emptyTable: "No CPU Processes Found"
            },
            data: [data],
            columns:  [
                { data: 'total'},
                { data: 'used-number' },
                { data: 'used-percent' },
                { data: 'free-number' },
                { data: 'free-percent' },
                { data: 'available-number' },
                { data: 'available-percent'},
            ],});
    }
    catch{}

    return ref

}

export function SensorData(ref, data){

    $(ref).DataTable({
        language: {
          emptyTable: "No Environment Detected"
        },
        data: data,
        columns:  [
          { data: 'name' },
          { data: 'location' },
          { data: 'state' },
          { data: 'current-reading' },
          { data: 'sensor-units' }
      ],
      fnRowCallback: function (nRow, aData) {

        try{
          if(aData['state'] === 'Normal' ||  aData['state'] === 'GREEN'){
              $('td:eq(2)', nRow).addClass('env-row-text')
              $('td:eq(3)', nRow).addClass('env-row-text')
          }
          else if(aData['state'].includes('Fan')){
            //pass
        }
          else if(aData['state'] !== 'Normal' || aData['state'] === 'GREEN'){
            $(nRow).addClass('env-row-text-warn')
            $(nRow).addClass('env-row-text-warn')
          }
        }
        catch{}
      }
        });

    return ref

}

export function PoeData(ref, data){

    try{
        $(ref).DataTable({
        language: {
            emptyTable: "No PoE Ports"
        },
        data:data,
        columns:  [
            { data: 'intf-name' },
            { data: 'poe-intf-enabled' },
            { data: 'power-used' },
            { data: 'pd-class' },
        ]
        });
    }
    catch{}

}

export function InvTransieverData(ref, data){

    try{
        $(ref).DataTable({
        language: {
            emptyTable: "No Environment Detected"
        },
        data: data,
        columns:  [
            { data: 'name' },
            { data: 'serial-no' },
            { data: 'connector' },
            { data: 'vendor' },
        ],
        fnRowCallback: function (nRow, aData) {
            try{
            $('td:eq(2)', nRow).html(aData['connector'].replace('connector', ' '))
            }
            catch{}
        }
        });
    }
    catch{}

}

export function TransieverData(ref, data){

    try{
        $(ref).DataTable({
        language: {
            emptyTable: "No Environment Detected"
        },
        data: data,
        columns:  [
            { data: 'name' },
            { data: 'fault-condition' },
            { data: 'internal-temp' },
            { data: 'connector' },
            { data: 'ethernet-pmd' },
            { data: 'output-power.instant' },
            { data: 'input-power.instant' },
            { data: 'laser-bias-current.instant' },
        ],
        fnRowCallback: function (nRow, aData) {

            try{
                $('td:eq(3)', nRow).html(aData['connector'].replace('connector', ' '))
                $('td:eq(4)', nRow).html(aData['ethernet-pmd'].replace('SFP', ' '))
                if(aData['fault-condition'] === false){
                    $('td:eq(1)', nRow).addClass('env-row-text')
                }
                else if(aData['fault-condition'] === 'true'){
                    $(nRow).addClass('env-row-text-warn blinking')
                }
            }
            catch{}
        }
        });
    }
    catch{}

}

export function AccesPortData(ref, data){

    try{
        $(ref).DataTable({
            data: data,
            language: {
            emptyTable: "No Access Ports Assigned"
            },
            columns:  [
            { data: 'interface' },
            { data: 'vlan'},
            { data: 'status' },
            { data: 'mbpsOut' },
            { data: 'mbpsIn' }
        ],
        fnRowCallback: function (nRow, aData) {
            try{
            //Change Back to 'ready'
            if(aData['status'] === 'if-oper-state-ready'){
                $('td:eq(2)', nRow).html('up')
                $('td:eq(2)', nRow).addClass('env-row-text')
            }
            else{
            $('td:eq(2)', nRow).html('down')
            $('td:eq(2)', nRow).addClass('env-row-text-warn')
            }
        }
            catch{}
        }
            });
    }
    catch{}

    return ref

}

export function MacAddressData(ref, data){

  try{
    $(ref).DataTable({
        data: data,
        language: {
          emptyTable: "No MAC Addresses Found"
        },
        columns:  [
          { data: 'vlan-id-number'},
          { data: 'mac'},
          { data: 'mat-addr-type' },
          { data: 'port' }
      ]
      });
    }
    catch{}

      return ref
}

export function SpanTableData(ref, data){

    try{
          $(ref).DataTable({
            data: data,
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

    return ref

}


export function TrunkData(ref, data){

    try{
        $(ref).DataTable({
            data: data
            ,language: {
            emptyTable: "No Trunks Configured"
            },
            columns:  [
            { data: 'interface' },
            { data: 'vlans' },
            { data: 'status' },
            { data: 'mbpsOut' },
            { data: 'mbpsIn' }
        ],
        fnRowCallback: function (nRow, aData) {
            try{
            if(aData['status'] !== 'down'){
                $('td:eq(2)', nRow).html('up')
                $('td:eq(2)', nRow).addClass('env-row-text')
            }
            else{
                $('td:eq(2)', nRow).html('down')
                $('td:eq(2)', nRow).addClass('env-row-text-warn')
            }
            }
            catch{}
        }});
    }
    catch{}

    return ref

}

export function VlanData(ref, data){

    try{
        $(ref).DataTable({
            data: data,
            language: {
            emptyTable: "No Vlans Configured"
            },
            columns:  [
            { data: 'id' },
            { data: 'name' },
            { data: 'status' },
            { data: 'interfaces'}
        ]});
    }
    catch{}

    return ref

}

export function RoutingProtocolData(ref, data){

    try{
        $(ref).DataTable({
          language: {
            emptyTable: "Something Went Wrong"
          },
          data: data,
          columns:  [
            { data: 'protocol' },
            { data: 'id' },
            { data: 'name' },
            { data: 'type' },
            { data: 'interfaces' },
        ]});
      }
    catch{}

    return ref
}


export function RibDiffData(ref, data){

    try{
        $(ref).DataTable({
          language: {
            emptyTable: "Rib Empty"
          },
          data:data,
          columns:  [
            { data: 'dest_prefix' },
            { data: 'next_hop' },
            { data: 'outgoing_interface' },
            { data: 'source_protocol' },
            { data: 'time' },
        ],
        fnRowCallback: function (nRow, aData) {
            try{
                if(aData['status'] === 'green'){
                      $(nRow).addClass('env-row-text')
                    }
                else if(aData['status'] === 'orange'){
                        $(nRow).addClass('env-row-text-warn')
                      }
              }
            catch(e){console.log(e)}
          }});
      }

    catch{}

    return ref


}


export function Ipv4Ribs(ref, data){

    try{
        $(ref).DataTable({
          language: {
            emptyTable: "Rib Empty"
          },
          data:data,
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

    return ref


}

export function Ipv6Ribs(ref, data){

    try{
        $(ref).DataTable({
          language: {
            emptyTable: "Rib Empty"
          },
          data:data,
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

    return ref


}
