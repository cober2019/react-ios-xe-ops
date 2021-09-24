const RouteDetails = () => {

    const date = new Date();
	const time = date.getMinutes();

    var routeFlaps = {"flaps": { "routes": [[
        {
            "active": "Active Route",
            "address_family": "ietf-routing:ipv4",
            "dest_prefix": "192.168.1.0/24",
            "metric": 110,
            "name": "ipv4-default",
            "next_hop": "10.1.1.1",
            "outgoing_interface": "GigabitEthernet0/0/5",
            "route_preference": 110,
            "source_protocol": "ietf-ospf:ospfv2",
            "status": "orange",
            "time": time
        },
        {
            "active": "Active Route",
            "address_family": "ietf-routing:ipv4",
            "dest_prefix": "192.168.4.0/24",
            "metric": 110,
            "name": "ipv4-default",
            "next_hop": "10.1.1.1",
            "outgoing_interface": "GigabitEthernet0/0/5",
            "route_preference": 110,
            "source_protocol": "ietf-ospf:ospfv2",
            "status": "orange",
            "time": time
        },
        {
            "active": "Active Route",
            "address_family": "ietf-routing:ipv4",
            "dest_prefix": "1.1.1.0",
            "metric": 110,
            "name": "ipv4-default",
            "next_hop": "10.1.1.1",
            "outgoing_interface": "GigabitEthernet0/0/5",
            "route_preference": 110,
            "source_protocol": "ietf-ospf:ospfv2",
            "status": "orange",
            "time": time
        }
    ],
    [
        {
            "active": "Active Route",
            "address_family": "ietf-routing:ipv4",
            "dest_prefix": "192.168.1.0/24",
            "metric": 110,
            "name": "ipv4-default",
            "next_hop": "10.1.1.1",
            "outgoing_interface": "GigabitEthernet0/0/5",
            "route_preference": 110,
            "source_protocol": "ietf-ospf:ospfv2",
            "status": "orange",
            "time": time
        },
        {
            "active": "Active Route",
            "address_family": "ietf-routing:ipv4",
            "dest_prefix": "192.168.4.0/24",
            "metric": 110,
            "name": "ipv4-default",
            "next_hop": "10.1.1.1",
            "outgoing_interface": "GigabitEthernet0/0/5",
            "route_preference": 110,
            "source_protocol": "ietf-ospf:ospfv2",
            "status": "orange",
            "time": time
        },
        {
            "active": "Active Route",
            "address_family": "ietf-routing:ipv4",
            "dest_prefix": "1.1.1.0",
            "metric": 110,
            "name": "ipv4-default",
            "next_hop": "10.1.1.1",
            "outgoing_interface": "GigabitEthernet0/0/5",
            "route_preference": 110,
            "source_protocol": "ietf-ospf:ospfv2",
            "status": "orange",
            "time": "11:17:31"
        }
    ]]
    
},
}

    const randomData =  Math.floor(Math.random() * routeFlaps.flaps.routes.length);

    return {"flaps": { "routes": routeFlaps.flaps.routes[randomData]},
    "protocols": [
        {
            "id": "0",
            "interfaces": "Not Assigned",
            "name": "default",
            "protocol": "ietf-routing:direct",
            "type": "ietf-routing:default-routing-instance"
        },
        {
            "id": "0",
            "interfaces": "Not Assigned",
            "name": "default",
            "protocol": "ietf-routing:static",
            "type": "ietf-routing:default-routing-instance"
        },
        {
            "id": "100",
            "interfaces": "Not Assigned",
            "name": "default",
            "protocol": "ietf-ospf:ospfv2",
            "type": "ietf-routing:default-routing-instance"
        },
        {
            "id": "65000",
            "interfaces": "Not Assigned",
            "name": "default",
            "protocol": "cisco-routing-ext:bgp",
            "type": "ietf-routing:default-routing-instance"
        }
    ],
    "ribsEntries": {
        "ietf-routing:ipv4": routeFlaps.flaps.routes[randomData]     
    }
}
}
