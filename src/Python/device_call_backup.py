"""Helper functions that get output via netmiko"""

import collections
import ipaddress
from netmiko import ConnectHandler, ssh_exception

def creat_netmiko_connection(username, password, host) -> object:
    """Logs into device and returns a connection object to the caller. """

    credentials = {
        'device_type': 'cisco_ios',
        'host': host,
        'username': username,
        'password': password,
        'port': 22,
        'session_log': 'my_file.out'}

    try:
        device_connect = ConnectHandler(**credentials)
    except ssh_exception.AuthenticationException:
        device_connect = "ssh_exception"
    except EOFError:
        device_connect = "Authenitcation Error"
    except ssh_exception.NetmikoTimeoutException:
        device_connect = 'Connection Timeout'

    return device_connect

def send_command(command, username, password, host):
    """Send Netmiko commands"""
    try:
        with creat_netmiko_connection(username, password, host) as session:
            try:
                response = session.send_command(command)
            except (OSError, TypeError, AttributeError, ssh_exception.NetmikoTimeoutException):
                pass
    except ValueError:
        pass
        
    return response

def get_ospf_status():
    """Gets OSPF neighbor statuses"""

    neighbor_status = collections.defaultdict(list)

    # Delete table data
    DbOps.delete_rows('ospf_front_end', device)

    try:
        if send_command('show ip ospf neighbor').splitlines():
            for i in send_command('show ip ospf neighbor').splitlines():
                try:
                    neighbor = ipaddress.ip_address(i.split()[0])
                    neighbor_status[neighbor].append(
                        {"NeighborID": i.split()[0], 'State': i.split()[2].strip("/"), 'Address': i.split()[5],
                         'Interface': i.split()[6]})
                except (IndexError, ValueError):
                    pass
        else:
            if send_command('show ip ospf').splitlines():
                neighbor_status['neighbor'].append(
                    {"NeighborID": 'No Established Neighbors', 'State': 'None', 'Address': 'None', 'Interface': 'None'})
            else:
                neighbor_status = []

        if neighbor_status:
            for k, v in neighbor_status.items():
                for i in v:
                    db_session = DbOps.update_ospf_table(device, i['NeighborID'], i['State'], i['Address'],
                                                         i['Interface'])

    except AttributeError:
        pass

def get_arp():
    """Get ARP table"""

    # Delete table data
    DbOps.delete_rows('arp_front_end', device)

    try:
        for i in send_command('show ip arp').splitlines():
            try:
                if i.split()[0] != 'Protocol':
                    DbOps.update_arp_table(device, i.split()[0], i.split()[1], i.split()[2], i.split()[3],
                                           i.split()[4],
                                           i.split()[5])
            except IndexError:
                pass
    except AttributeError:
        pass


def get_hsrp_status(username, password, host):
    """Gets HSRP operation data"""

    hsrp_data = []

    try:
        for interface in send_command('show standby brief | ex Interface', username, password, host).splitlines():
            if len(interface.split()) == 0:
                continue
            else:
                try:
                    hsrp_data.append({'vlanInt': interface.split()[0], 'group': interface.split()[1], 'priority': interface.split()[2], 'state':  interface.split()[4],
                    'active': interface.split()[5], 'standby': interface.split()[6], 'vip':  interface.split()[7]}) 
                except IndexError:
                    pass
    except AttributeError:
        pass
    
    return hsrp_data

def get_dmvpn():
    """Gets dmvpn peers, attributes, status, writes to DB"""

    interface, router_type = None, None

    for line in send_command('show dmvpn | b Interface').splitlines():
        if len(line.split()) == 0 or '-' in line or '#' in line:
            continue
        elif len(line.split()) == 6:
            DbOps.update_dmvpn_table(device, line.split()[1], line.split()[2],
                                     line.split()[3], line.split()[4], line.split()[5])


def get_dmvpn_info():
    """Gets dmvpn peers, attributes, status, writes to DB"""

    interface = None

    for line in send_command('show dmvpn | i Interface|Type').splitlines():
        if len(line.split()) == 0:
            continue
        elif len(line.split()) == 5:
            interface = line.split()[1].strip(',')
            get_dmvpn_interface(session, interface, device)
        elif len(line.split()) == 3:
            router_type = line.split(':')[1].split(',')[0]
            peer_count = line.split()[2].strip('Peers:').strip(',')
            DbOps.update_dmvpn_count(device, interface, router_type, peer_count)


def indivisual_poll(user, pwd, host, port, polling, interface=None):
    global session, device

    username = user
    password = pwd
    device = host
    ssh_port = port
    session = ConnectWith.creat_netmiko_connection(username, password, device, ssh_port)

    if polling == 'arp':
        get_arp()
    elif polling == 'bgp':
        get_bgp_status()
    elif polling == 'ospf':
        get_ospf_status()
    elif polling == 'mac':
        get_mac_arp_table()
    elif polling == 'cdp':
        get_cdp_neighbors()
    elif polling == 'span':
        get_span_root()
    elif polling == 'access':
        get_access_ports()
    elif polling == 'clearInt':
        clear_counters(interface)
    elif polling == 'clearArp':
        clear_arp()
    elif polling == 'refreshArp':
        get_arp()
    elif polling == 'vlans':
        get_vlans()
    elif polling == 'trunk_helper':
        trunks = netconf_trunk_helper(interface)
        return trunks
    elif polling == 'hsrp':
        get_hsrp_status()
    elif polling == 'peer_count':
        get_dmvpn()
    elif polling == 'borderRouters':
        get_ospf_routers()

