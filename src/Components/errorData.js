

export const ErrorDataIndex = 
[{}, [[]], [{'Cisco-IOS-XE-cdp-oper:cdp-neighbor-details': {'cdp-neighbor-detail': []}},{'Cisco-IOS-XE-lldp-oper:lldp-entries': {'lldp-entry': []}}],
[{'Cisco-IOS-XE-process-cpu-oper:cpu-utilization': {'cpu-usage-processes': {'cpu-usage-process': []}, 'five-seconds': []}}],
{'Cisco-IOS-XE-environment-oper:environment-sensors':{'environment-sensor': []}}, [{'memory-stats': {'memory-status': []}}], 
{'qos': {"allocation": '', "direction": '', "policy": '', "queues": []}}]

export const ErrorDataL2 = [[[]]]

export const VlansData = [{'id': 1, 'name': 'You Should Never Use This One', 'status': 'active', 'interfaces': 'GigabitEthernet1/0/15, GigabitEthernet1/0/16, GigabitEthernet1/0/17, GigabitEthernet1/0/18, GigabitEthernet1/0/19, GigabitEthernet1/0/20, GigabitEthernet1/0/21, GigabitEthernet1/0/23, GigabitEthernet1/0/24'}, 
                {'id': 2, 'name': 'Always In The Way (Security)', 'status': 'active', 'interfaces': ['GigabitEthernet1/0/1', 'GigabitEthernet1/0/2', 'GigabitEthernet1/0/3']}, 
                {'id': 3, 'name': 'People Who Do Nothing', 'status': 'active', 'interfaces': ['GigabitEthernet1/0/4', 'GigabitEthernet1/0/7', 'GigabitEthernet1/0/8']}, 
                {'id': 4, 'name': 'Help Desk', 'status': 'active', 'interfaces': ['GigabitEthernet1/0/9, GigabitEthernet1/0/10, GigabitEthernet1/0/11']}, 
                {'id': 5, 'name': 'Cloud Net Engineers', 'status': 'active', 'interfaces': []},
                {'id': 6, 'name': 'Real Net Engineers', 'status': 'active', 'interfaces': []},  
                {'id': 1002, 'name': 'fddi-default', 'status': 'suspend', 'interfaces': []}, 
                {'id': 1003, 'name': 'trcrf-default', 'status': 'suspend', 'interfaces': ['GigabitEthernet1/0/12', 'GigabitEthernet1/0/13', 'GigabitEthernet1/0/1']}, 
                {'id': 1004, 'name': 'fddinet-default', 'status': 'suspend', 'interfaces': []}, 
                {'id': 1005, 'name': 'trbrf-default', 'status': 'suspend', 'interfaces': []}]

export const TrunkData = () => {
            return  [{'interface': 'GigabitEthernet1/0/14', 'vlans': 'all', 'status': 'up', 'mbpsOut': Math.floor(Math.random() * 100), 'mbpsIn': Math.floor(Math.random() * 100)}, 
                        {'interface': 'GigabitEthernet1/0/15', 'vlans': '1-500', 'status': 'up', 'mbpsOut': Math.floor(Math.random() * 100), 'mbpsIn': Math.floor(Math.random() * 100)}, 
                        {'interface': 'GigabitEthernet1/0/16', 'vlans': '501-1000', 'status': 'up', 'mbpsOut': Math.floor(Math.random() * 100), 'mbpsIn': Math.floor(Math.random() * 100)}, 
                        {'interface': 'GigabitEthernet1/0/17', 'vlans': 'all', 'status': 'up', 'mbpsOut': Math.floor(Math.random() * 100), 'mbpsIn': Math.floor(Math.random() * 100)}]
            }

export const AccessData = () => {
            return  [{'interface': 'GigabitEthernet1/0/18', 'vlan': '1', 'status': 'up', 'mbpsOut': Math.floor(Math.random() * 100), 'mbpsIn': Math.floor(Math.random() * 100)}, 
                        {'interface': 'GigabitEthernet1/0/19', 'vlan': '2', 'status': 'up', 'mbpsOut': Math.floor(Math.random() * 100), 'mbpsIn': Math.floor(Math.random() * 100)}, 
                        {'interface': 'GigabitEthernet1/0/20', 'vlan': '3', 'status': 'up', 'mbpsOut': Math.floor(Math.random() * 100), 'mbpsIn': Math.floor(Math.random() * 100)}, 
                        {'interface': 'GigabitEthernet1/0/21', 'vlan': '4', 'status': 'up', 'mbpsOut': Math.floor(Math.random() * 100), 'mbpsIn': Math.floor(Math.random() * 100)}]
        }

export const DpData = [{'device-name': 'Deleware-switch', 'platform-name': 'Cisco 3850', 'port-id': 'GigabitEthernet1/0/11', 'duplex': 'full', 'capability': 'S', 'mgmt-address': '1.1.1.1', 'ip-address': '192.168.1.1', 'local-intf-name': 'GigabitEthernet1/0/14'}, 
                    {'device-name':  'Pa-switch', 'platform-name': 'Cisco 30000', 'port-id': 'GigabitEthernet1/0/12', 'duplex': 'half', 'capability': 'S', 'mgmt-address': '2.2.2.2', 'ip-address': '192.168.2.1', 'local-intf-name': 'GigabitEthernet1/0/15'}, 
                    {'device-name': 'WV-switch', 'platform-name': 'Cisco 20000', 'port-id': 'GigabitEthernet1/0/13', 'duplex': 'full', 'capability': 'S', 'mgmt-address': '3.3.3.3', 'ip-address': '192.168.3.1', 'local-intf-name': 'GigabitEthernet1/0/16'}, 
                    {'device-name': 'Virginia-switch', 'platform-name': 'Cisco 10000', 'port-id': 'GigabitEthernet1/0/14', 'duplex': 'full', 'capability': 'S', 'mgmt-address': '4.4.4.4', 'ip-address': '192.168.4.1', 'local-intf-name': 'GigabitEthernet1/0/17'}]
        

export const EnvData = () => {
         return [{'name': 'PEM Iout', 'location': 'P0', 'state': 'Normal', 'current-reading': Math.floor(Math.random() * 30), 'sensor-units': 'ampres'}, 
                    {'name': 'PEM Iout', 'location': 'P1', 'state': 'Normal', 'current-reading': Math.floor(Math.random() * 30), 'sensor-units': 'ampres'}, 
                    {'name': 'Cpu-2', 'location': 'R0', 'state': 'Normal', 'current-reading': Math.floor(Math.random() * 30), 'sensor-units': 'volts-dc'}, 
                    {'name': 'Cpu-1', 'location': 'R1', 'state': 'Normal', 'current-reading': Math.floor(Math.random() * 30), 'sensor-units': 'volts-dc'}]

        }
        


export const QosData= () => {
             return {'qos': {
                        "allocation": 50,
                        "direction": "outbound",
                        "policy": "Parent_Shaper",
                        "queues": [
                        {
                            "bytes": "42700507055407",
                            "parent": "Shaper class-default",
                            "pkts": "50646817599",
                            "queue-name": "class-default",
                            "rate": Math.floor(Math.random() * 1000)
                        },
                        {
                            "bytes": "268880107390",
                            "parent": "Shaper class-default",
                            "pkts": "2016870903",
                            "queue-name": "Real_time",
                            "rate": Math.floor(Math.random() * 1000)
                        },
                        {
                            "bytes": "1325590758",
                            "parent": "Shaper class-default",
                            "pkts": "2207535",
                            "queue-name": "Important",
                            "rate": Math.floor(Math.random() * 1000)
                        },
                        {
                            "bytes": "41657915047129",
                            "parent": "Shaper class-default",
                            "pkts": "48040951950",
                            "queue-name": "A_Little_Less_Important",
                            "rate": Math.floor(Math.random() * 1000)
                        },
                        {
                            "bytes": "772386310130",
                            "parent": "Shaper class-default",
                            "pkts": "586787211",
                            "queue-name": "Execs",
                            "rate": Math.floor(Math.random() * 1000)
                        }
                        ]
                    }
                    }
    
}

export const InterfaceData = () => {

                return  {"GigabitEthernet1": {
                                    "arps": [],
                                    "data": {
                                        "admin-status": "if-state-up",
                                        "bia-address": "00:50:56:bf:78:ac",
                                        "description": "MANAGEMENT INTERFACE - DON'T TOUCH ME",
                                        "ether-state": {
                                            "auto-negotiate": true,
                                            "enable-flow-control": false,
                                            "media-type": "ether-media-type-virtual",
                                            "negotiated-duplex-mode": "full-duplex",
                                            "negotiated-port-speed": "speed-1gb"
                                        },
                                        "ether-stats": {
                                            "in-8021q-frames": "0",
                                            "in-fragment-frames": "0",
                                            "in-jabber-frames": "0",
                                            "in-mac-control-frames": "0",
                                            "in-mac-pause-frames": "0",
                                            "in-oversize-frames": "0",
                                            "out-8021q-frames": "0",
                                            "out-mac-control-frames": "0",
                                            "out-mac-pause-frames": "0"
                                        },
                                        "if-index": 1,
                                        "input-security-acl": "",
                                        "interface-type": "iana-iftype-ethernet-csmacd",
                                        "ipv4": "10.10.20.48",
                                        "ipv4-subnet-mask": "255.255.255.0",
                                        "ipv4-tcp-adjust-mss": 0,
                                        "ipv6-tcp-adjust-mss": 0,
                                        "last-change": "2021-08-25T13:30:16.246+00:00",
                                        "mtu": 1500,
                                        "name": "GigabitEthernet1",
                                        "oper-status": "down",
                                        "output-security-acl": "",
                                        "phys-address": "00:50:56:bf:78:ac",
                                        "speed": "1000000000",
                                        "statistics": {
                                            "discontinuity-time": "2021-08-25T13:28:28+00:00",
                                            "in-broadcast-pkts": "0",
                                            "in-crc-errors": "0",
                                            "in-discards": 0,
                                            "in-discards-64": "0",
                                            "in-errors": 0,
                                            "in-errors-64": "0",
                                            "in-multicast-pkts": "0",
                                            "in-octets": "4702361",
                                            "in-unicast-pkts": "42094",
                                            "in-unknown-protos": 0,
                                            "in-unknown-protos-64": "0",
                                            "num-flaps": "0",
                                            "out-broadcast-pkts": "0",
                                            "out-discards": "0",
                                            "out-errors": "0",
                                            "out-multicast-pkts": "0",
                                            "out-octets": 23011780,
                                            "out-octets-64": "23011780",
                                            "out-unicast-pkts": "47571",
                                            "rx-kbps": 2,
                                            "rx-pps": "15",
                                            "tx-kbps": 8,
                                            "tx-pps": "17"
                                        },
                                        "storm-control": {
                                            "broadcast": {
                                                "filter-state": "inactive"
                                            },
                                            "multicast": {
                                                "filter-state": "inactive"
                                            },
                                            "unicast": {
                                                "filter-state": "inactive"
                                            },
                                            "unknown-unicast": {
                                                "filter-state": "inactive"
                                            }
                                        },
                                        "v4-protocol-stats": {
                                            "in-discarded-pkts": "0",
                                            "in-error-pkts": "0",
                                            "in-forwarded-octets": "0",
                                            "in-forwarded-pkts": "0",
                                            "in-octets": "4695732",
                                            "in-pkts": "42037",
                                            "out-discarded-pkts": "0",
                                            "out-error-pkts": "0",
                                            "out-forwarded-octets": "0",
                                            "out-forwarded-pkts": "47525",
                                            "out-octets": "23005439",
                                            "out-pkts": "47526"
                                        },
                                        "v6-protocol-stats": {
                                            "in-discarded-pkts": "0",
                                            "in-error-pkts": "0",
                                            "in-forwarded-octets": "0",
                                            "in-forwarded-pkts": "0",
                                            "in-octets": "0",
                                            "in-pkts": "0",
                                            "out-discarded-pkts": "0",
                                            "out-error-pkts": "0",
                                            "out-forwarded-octets": "0",
                                            "out-forwarded-pkts": "0",
                                            "out-octets": "0",
                                            "out-pkts": "0"
                                        },
                                        "vrf": ""
                                    },
                                    "interface": "GigabitEthernet1"
                                },
                                "GigabitEthernet2": {
                                    "arps": [],
                                    "data": {
                                        "admin-status": "if-state-down",
                                        "bia-address": "00:50:56:bf:4e:a3",
                                        "description": "Network Interface",
                                        "ether-state": {
                                            "auto-negotiate": true,
                                            "enable-flow-control": false,
                                            "media-type": "ether-media-type-virtual",
                                            "negotiated-duplex-mode": "full-duplex",
                                            "negotiated-port-speed": "speed-1gb"
                                        },
                                        "ether-stats": {
                                            "in-8021q-frames": "0",
                                            "in-fragment-frames": "0",
                                            "in-jabber-frames": "0",
                                            "in-mac-control-frames": "0",
                                            "in-mac-pause-frames": "0",
                                            "in-oversize-frames": "0",
                                            "out-8021q-frames": "0",
                                            "out-mac-control-frames": "0",
                                            "out-mac-pause-frames": "0"
                                        },
                                        "if-index": 2,
                                        "input-security-acl": "",
                                        "interface-type": "iana-iftype-ethernet-csmacd",
                                        "ipv4": "0.0.0.0",
                                        "ipv4-subnet-mask": "0.0.0.0",
                                        "ipv4-tcp-adjust-mss": 0,
                                        "ipv6-tcp-adjust-mss": 0,
                                        "last-change": "2021-08-25T13:30:09.666+00:00",
                                        "mtu": 1500,
                                        "name": "GigabitEthernet2",
                                        "oper-status": "down",
                                        "output-security-acl": "",
                                        "phys-address": "00:50:56:bf:4e:a3",
                                        "speed": "1000000000",
                                        "statistics": {
                                            "discontinuity-time": "2021-08-25T13:28:28+00:00",
                                            "in-broadcast-pkts": "0",
                                            "in-crc-errors": "0",
                                            "in-discards": 0,
                                            "in-discards-64": "0",
                                            "in-errors": 0,
                                            "in-errors-64": "0",
                                            "in-multicast-pkts": "0",
                                            "in-octets": "300",
                                            "in-unicast-pkts": "5",
                                            "in-unknown-protos": 0,
                                            "in-unknown-protos-64": "0",
                                            "num-flaps": "0",
                                            "out-broadcast-pkts": "0",
                                            "out-discards": "0",
                                            "out-errors": "0",
                                            "out-multicast-pkts": "0",
                                            "out-octets": 0,
                                            "out-octets-64": "0",
                                            "out-unicast-pkts": "0",
                                            "rx-kbps": 8,
                                            "rx-pps": "0",
                                            "tx-kbps": 3,
                                            "tx-pps": "0"
                                        },
                                        "storm-control": {
                                            "broadcast": {
                                                "filter-state": "inactive"
                                            },
                                            "multicast": {
                                                "filter-state": "inactive"
                                            },
                                            "unicast": {
                                                "filter-state": "inactive"
                                            },
                                            "unknown-unicast": {
                                                "filter-state": "inactive"
                                            }
                                        },
                                        "v4-protocol-stats": {
                                            "in-discarded-pkts": "0",
                                            "in-error-pkts": "0",
                                            "in-forwarded-octets": "0",
                                            "in-forwarded-pkts": "0",
                                            "in-octets": "0",
                                            "in-pkts": "0",
                                            "out-discarded-pkts": "0",
                                            "out-error-pkts": "0",
                                            "out-forwarded-octets": "0",
                                            "out-forwarded-pkts": "0",
                                            "out-octets": "0",
                                            "out-pkts": "0"
                                        },
                                        "v6-protocol-stats": {
                                            "in-discarded-pkts": "0",
                                            "in-error-pkts": "0",
                                            "in-forwarded-octets": "0",
                                            "in-forwarded-pkts": "0",
                                            "in-octets": "0",
                                            "in-pkts": "0",
                                            "out-discarded-pkts": "0",
                                            "out-error-pkts": "0",
                                            "out-forwarded-octets": "0",
                                            "out-forwarded-pkts": "0",
                                            "out-octets": "0",
                                            "out-pkts": "0"
                                        },
                                        "vrf": ""
                                    },
                                    "interface": "GigabitEthernet2"
                                },
                                "GigabitEthernet3": {
                                    "arps": [],
                                    "data": {
                                        "admin-status": "if-state-down",
                                        "bia-address": "00:50:56:bf:7d:b4",
                                        "description": "Network Interface",
                                        "ether-state": {
                                            "auto-negotiate": true,
                                            "enable-flow-control": false,
                                            "media-type": "ether-media-type-virtual",
                                            "negotiated-duplex-mode": "full-duplex",
                                            "negotiated-port-speed": "speed-1gb"
                                        },
                                        "ether-stats": {
                                            "in-8021q-frames": "0",
                                            "in-fragment-frames": "0",
                                            "in-jabber-frames": "0",
                                            "in-mac-control-frames": "0",
                                            "in-mac-pause-frames": "0",
                                            "in-oversize-frames": "0",
                                            "out-8021q-frames": "0",
                                            "out-mac-control-frames": "0",
                                            "out-mac-pause-frames": "0"
                                        },
                                        "if-index": 3,
                                        "input-security-acl": "",
                                        "interface-type": "iana-iftype-ethernet-csmacd",
                                        "ipv4": "0.0.0.0",
                                        "ipv4-subnet-mask": "0.0.0.0",
                                        "ipv4-tcp-adjust-mss": 0,
                                        "ipv6-tcp-adjust-mss": 0,
                                        "last-change": "2021-08-25T13:30:09.674+00:00",
                                        "mtu": 1500,
                                        "name": "GigabitEthernet3",
                                        "oper-status": "down",
                                        "output-security-acl": "",
                                        "phys-address": "00:50:56:bf:7d:b4",
                                        "speed": "1000000000",
                                        "statistics": {
                                            "discontinuity-time": "2021-08-25T13:28:28+00:00",
                                            "in-broadcast-pkts": "0",
                                            "in-crc-errors": "0",
                                            "in-discards": 0,
                                            "in-discards-64": "0",
                                            "in-errors": 0,
                                            "in-errors-64": "0",
                                            "in-multicast-pkts": "0",
                                            "in-octets": "0",
                                            "in-unicast-pkts": "0",
                                            "in-unknown-protos": 0,
                                            "in-unknown-protos-64": "0",
                                            "num-flaps": "0",
                                            "out-broadcast-pkts": "0",
                                            "out-discards": "0",
                                            "out-errors": "0",
                                            "out-multicast-pkts": "0",
                                            "out-octets": 0,
                                            "out-octets-64": "0",
                                            "out-unicast-pkts": "0",
                                            "rx-kbps": 3,
                                            "rx-pps": "0",
                                            "tx-kbps": 8,
                                            "tx-pps": "0"
                                        },
                                        "storm-control": {
                                            "broadcast": {
                                                "filter-state": "inactive"
                                            },
                                            "multicast": {
                                                "filter-state": "inactive"
                                            },
                                            "unicast": {
                                                "filter-state": "inactive"
                                            },
                                            "unknown-unicast": {
                                                "filter-state": "inactive"
                                            }
                                        },
                                        "v4-protocol-stats": {
                                            "in-discarded-pkts": "0",
                                            "in-error-pkts": "0",
                                            "in-forwarded-octets": "0",
                                            "in-forwarded-pkts": "0",
                                            "in-octets": "0",
                                            "in-pkts": "0",
                                            "out-discarded-pkts": "0",
                                            "out-error-pkts": "0",
                                            "out-forwarded-octets": "0",
                                            "out-forwarded-pkts": "0",
                                            "out-octets": "0",
                                            "out-pkts": "0"
                                        },
                                        "v6-protocol-stats": {
                                            "in-discarded-pkts": "0",
                                            "in-error-pkts": "0",
                                            "in-forwarded-octets": "0",
                                            "in-forwarded-pkts": "0",
                                            "in-octets": "0",
                                            "in-pkts": "0",
                                            "out-discarded-pkts": "0",
                                            "out-error-pkts": "0",
                                            "out-forwarded-octets": "0",
                                            "out-forwarded-pkts": "0",
                                            "out-octets": "0",
                                            "out-pkts": "0"
                                        },
                                        "vrf": ""
                                    },
                                    "interface": "GigabitEthernet3"
                                }
                            }


}

