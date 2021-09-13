export const RoutingData = {
    
    "bgp": [
        {
            "installed-prefixes": 1210,
            "last-reset": "13w0d",
            "local-port": 179,
            "localIp": "10.231.1.141",
            "neighbor-id": "10.231.1.142",
            "prefixes-sent": "34",
            "received-prefixes": "1226",
            "remote-as": 3257,
            "remote-ip": "10.231.1.142",
            "remote-port": 62741,
            "state": "established"
        },
        {
            "installed-prefixes": 18,
            "last-reset": "1y38w",
            "local-port": 179,
            "localIp": "192.168.140.13",
            "neighbor-id": "192.168.140.15",
            "prefixes-sent": "1242",
            "received-prefixes": "24",
            "remote-as": 65360,
            "remote-ip": "192.168.140.15",
            "remote-port": 28150,
            "state": "established"
        }
    ],
    "bgpDetails": [
        65360,
        "default",
        "192.168.140.13",
        "905158067",
        "905158067",
        "1260",
        "312480",
        "default",
        "1282",
        "174352",
        "14",
        "528",
        "2",
        "128",
        "0",
        "0",
        "186294",
        "301843533",
        "60",
        "495352"
    ],
    "bgpToplogy": {
        "10.231.1.142": 3257,
        "192.168.140.15": 65360
    },
    "ospf": [
        {
            "address": "192.168.143.25",
            "bdr": "0.0.0.0",
            "dr": "0.0.0.0",
            "neighbor-id": "192.168.140.41",
            "state": "ospf-nbr-full",
            "stats": {}
        },
        {
            "address": "192.168.143.21",
            "bdr": "0.0.0.0",
            "dr": "0.0.0.0",
            "neighbor-id": "192.168.140.40",
            "state": "ospf-nbr-full",
            "stats": {}
        }
    ],
    "ospf_ints": [
        {
            "area": 0,
            "authentication": {
                "no-auth": 1
            },
            "bdr": "0.0.0.0",
            "bfd": false,
            "cost": 1,
            "dead-interval": 40,
            "demand-circuit": false,
            "dr": "0.0.0.0",
            "enable": true,
            "fast-reroute": {
                "candidate-disabled": false,
                "enabled": false,
                "remote-lfa-enabled": false
            },
            "hello-interval": 10,
            "hello-timer": 0,
            "lls": false,
            "mtu-ignore": false,
            "multi-area": {
                "cost": 0,
                "multi-area-id": 0
            },
            "name": "GigabitEthernet0/0/5",
            "network-type": "ospf-point-to-point",
            "node-flag": false,
            "ospf-neighbor": [
                {
                    "address": "192.168.143.25",
                    "bdr": "0.0.0.0",
                    "dr": "0.0.0.0",
                    "neighbor-id": "192.168.140.41",
                    "state": "ospf-nbr-full",
                    "stats": {
                        "nbr-event-count": 6,
                        "nbr-retrans-qlen": 7
                    }
                }
            ],
            "passive": false,
            "prefix-suppression": false,
            "priority": 0,
            "retransmit-interval": 5,
            "state": "Point-to-Point",
            "transmit-delay": 1,
            "ttl-security": {
                "enabled": false,
                "hops": 255
            },
            "wait-timer": 40
        },
        {
            "area": 0,
            "authentication": {
                "no-auth": 1
            },
            "bdr": "0.0.0.0",
            "bfd": false,
            "cost": 1,
            "dead-interval": 40,
            "demand-circuit": false,
            "dr": "0.0.0.0",
            "enable": true,
            "fast-reroute": {
                "candidate-disabled": false,
                "enabled": false,
                "remote-lfa-enabled": false
            },
            "hello-interval": 10,
            "hello-timer": 0,
            "lls": false,
            "mtu-ignore": false,
            "multi-area": {
                "cost": 0,
                "multi-area-id": 0
            },
            "name": "GigabitEthernet0/0/4",
            "network-type": "ospf-point-to-point",
            "node-flag": false,
            "ospf-neighbor": [
                {
                    "address": "192.168.143.21",
                    "bdr": "0.0.0.0",
                    "dr": "0.0.0.0",
                    "neighbor-id": "192.168.140.40",
                    "state": "ospf-nbr-full",
                    "stats": {
                        "nbr-event-count": 6,
                        "nbr-retrans-qlen": 4
                    }
                }
            ],
            "passive": false,
            "prefix-suppression": false,
            "priority": 0,
            "retransmit-interval": 5,
            "state": "Point-to-Point",
            "transmit-delay": 1,
            "ttl-security": {
                "enabled": false,
                "hops": 255
            },
            "wait-timer": 40
        }
    ]
}
