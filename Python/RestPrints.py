"""Collections of functions that retrive data from a cisco device"""

from json.decoder import JSONDecodeError
import requests
import json
import time
import os
import warnings
warnings.filterwarnings('ignore', message='Unverified HTTPS request')

headers = {"Content-Type": 'application/yang-data+json', 'Accept': 'application/yang-data+json'}

def get_interfaces(ip, port, username, password, ex_down=None):
    """Gets real time interface statistics using IOS-XE\n
        Cisco-IOS-XE-interfaces-oper:interfaces and live arp data via Cisco-IOS-XE-arp-oper:arp-data/arp-vrf"""

    data = {}
    interface_data = {}

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-interfaces-oper:interfaces"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        converted_json = json.loads(response.text)
        interface_data = converted_json.get('Cisco-IOS-XE-interfaces-oper:interfaces').get('interface')
    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
        pass
    
    if interface_data:
        try:
            uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-arp-oper:arp-data/arp-vrf"
            response = requests.get(uri, headers=headers, verify=False, auth=(username, password))

            converted_json = json.loads(response.text, strict=False)
            get_keys = dict.fromkeys(converted_json)
            parent_key = list(get_keys.keys())[0]

            for interface in interface_data:
                entries = []
                convert_bandwidth = _convert_to_mbps(interface)
                for i in converted_json[parent_key]:
                    try:
                        for entry in i.get('arp-oper'):
                            print(entry)
                            if entry.get('interface') == interface.get('name'):
                                entry.pop('interface')
                                entry['time'] = entry.get('time').split('.')[0].strip('T00')
                                entry.append(entry)
                    except TypeError:
                        pass

                data[interface.get('name')] = {'interface': interface.get('name'), 'data': convert_bandwidth, 'arps': entries}
                
        except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
            # No arp entries, device error
            for interface in interface_data:
                convert_bandwidth = _convert_to_mbps(interface)
                data[interface.get('name')] = {'interface': interface.get('name'), 'data': convert_bandwidth, 'arps': []}

    print(f"{'Interface':<33} {'Status':<15} {'Mbps In':<10}{'Mbps Out':<10}{'PPS In':<10} {'PPS Out':<12}{'MTU':<12}{'IP':<22} {'Mask':<1}")
    print("-------------------------------------------------------------------------------------------------------------------------------------------")
    for v in data.values():
        [_print_interfaces_extended(data, ex_down) for data in v.values() if isinstance(data, dict)]

    return data

def get_switch(ip, port, username, password):
    """Gets device trunks and access from a cisco device"""

    data = {}
    trunk =[]
    access = []

    try:
        interfaces_configs = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-native:native/interface"
        interface_status = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-interfaces-oper:interfaces"
        config_response = requests.get(interfaces_configs, headers=headers, verify=False, auth=(username, password))
        stats_response = requests.get(interface_status, headers=headers, verify=False, auth=(username, password))
        config_json = json.loads(config_response.text)
        stats_json = json.loads(stats_response.text)

        for interface, v in config_json['Cisco-IOS-XE-native:interface'].items():
            if isinstance(v, list):
                mapped = [map_switchports(config, interface, stats_json) for config in v]
                data[interface] = list(mapped)

    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL):
        pass
    
    if data:
        for v in data.values():
            for i in v:
                if i[0].get('mode') == 'trunk':
                    trunk.append(i[0])
                elif i[0].get('mode') == 'access':
                    access.append(i[0])
                
    if trunk:           
        print(f"{'Interface':<30} {'Mode':<15} {'Status':<28}{'Mbps In':<20}{'Mbps Out':<17}{'Allow Vlans':<13}")
        print("-------------------------------------------------------------------------------------------------------------------------------------------")
        [print(f"{i.get('interface', {}):<30}{i.get('mode', {}):<10} {i.get('status', {}):<35}{i.get('mbpsOut'):<20}{i.get('mbpsIn'):<20}{i.get('vlans'):<20}") for i in trunk]

    if access:
        print(f"{'Interface':<35} {'Status':<28} {'Mbps Out':<19}{'Mbps In':<20}{'Vlans'}")
        print("-------------------------------------------------------------------------------------------------------------------------------------------")
        [print(f"{i.get('interface', {}):<30}{i.get('status', {}):<35}{i.get('mbpsOut'):<20}{i.get('mbpsIn'):<20}{i.get('vlan'):<20}") for i in access]

    return trunk, access

def map_switchports(config, interface, interfaces_statuses):

    complete_interface = f"{interface}{config.get('name')}"
    interface_mode = False
    data = []
    statistics = next((interface for interface in interfaces_statuses['Cisco-IOS-XE-interfaces-oper:interfaces']['interface'] if interface['name'] == complete_interface), None)

    if config.get('switchport', {}).get('Cisco-IOS-XE-switch:mode', {}):
        interface_mode =  list(config.get('switchport', {}).get('Cisco-IOS-XE-switch:mode', {}).keys())[0]

    if interface_mode == 'access':
        access_vlan = config.get('switchport').get('Cisco-IOS-XE-switch:access').get('vlan').get('vlan')
        data.append({'mode': 'access','interface': complete_interface, 'vlan': access_vlan, 'status': statistics['oper-status'], 
        'mbpsOut': int(statistics['statistics']['tx-kbps'])/1000, 'mbpsIn': int(statistics['statistics']['rx-kbps'])/1000})

    elif interface_mode == 'trunk':
        if config.get("switchport").get("Cisco-IOS-XE-switch:trunk", {}).get("allowed", {}).get("vlan", {}).get("vlans", {}):
            trunked_vlans = config.get("switchport").get("Cisco-IOS-XE-switch:trunk", {}).get("allowed", {}).get("vlan", {}).get("vlans", {})
            native = config.get("switchport").get("Cisco-IOS-XE-switch:trunk", {}).get("native", {}).get("vlan", {})
        elif config.get("switchport").get("Cisco-IOS-XE-switch:trunk", {}).get("allowed", {}).get("vlan", {}).get("add", {}):
            trunked_vlans = config.get('switchport').get('Cisco-IOS-XE-switch:trunk').get('allowed').get('vlan').get('add').get('vlans')
            native = config.get("switchport").get("Cisco-IOS-XE-switch:trunk", {}).get("native", {}).get("vlan", {})
        elif config.get("switchport").get("Cisco-IOS-XE-switch:trunk", {}).get("allowed", {}).get("vlan", {}).get('vlans', {}):
            trunked_vlans = config.get('switchport').get('Cisco-IOS-XE-switch:trunk').get('allowed').get('vlan').get('vlans')
            native = config.get("switchport").get("Cisco-IOS-XE-switch:trunk", {}).get("native", {}).get("vlan", {})
        else:
            trunked_vlans = 'all'
            native = config.get("switchport").get("Cisco-IOS-XE-switch:trunk", {}).get("native", {}).get("vlan", {})

        data.append({'mode': 'trunk', 'interface': complete_interface, 'vlans': trunked_vlans, 'native': native, 'status': statistics['oper-status'], 
        'mbpsOut': int(statistics['statistics']['tx-kbps'])/1000, 'mbpsIn': int(statistics['statistics']['rx-kbps'])/1000})
    else:
        data.append({'mode': None, 'interface': complete_interface, 'status': statistics['oper-status'], 
        'mbpsOut': int(statistics['statistics']['tx-kbps'])/1000, 'mbpsIn': int(statistics['statistics']['rx-kbps'])/1000})

    return data

def get_dp_neighbors(ip, port, username, password):
    """Gets device components restconf/data/Cisco-IOS-XE-cdp-oper:cdp-neighbor-details"""

    data = []

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-cdp-oper:cdp-neighbor-details"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        converted_json = json.loads(response.text)
        data.append(converted_json)
    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
        data.append({})

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-lldp-oper:lldp-entries"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        converted_json = json.loads(response.text)
        data.append(converted_json)
    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
        data.append({})
        
    if data:
        _print_dp_neighbors(data)
            
    return data

def _print_dp_neighbors(data):

    print(f"{'Device':<50} {'Local Int':<25} {'Remote-Port':<20}{'Capability':<25}{'Duplex':<30}{'Platform':<25}{'Mgmt IP':<20}{'IP':<20}")
    print("------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
    if data[0].get('Cisco-IOS-XE-cdp-oper:cdp-neighbor-details', {}).get('cdp-neighbor-detail', {}):
        for i in data:
            if isinstance(i.get('Cisco-IOS-XE-cdp-oper:cdp-neighbor-details', {}).get('cdp-neighbor-detail', {}), list):
                for a in i['Cisco-IOS-XE-cdp-oper:cdp-neighbor-details']['cdp-neighbor-detail']:
                    print(f"{a['device-name']:<45}{a['local-intf-name']:<25}{a['port-id']:<25}{a['capability']:<25}{a['duplex']:<30}{a['platform-name']:<25}{a['mgmt-address']:<18}{a['ip-address']}")
    else:
        print('No CDP Neighbors or CDP isnt Enabled\n')

    print(f"\n{'Device':<38} {'Local Int':<30} {'Remote-Port':<33}{'Capability':<25}")
    print("-------------------------------------------------------------------------------------------------------------------------------------------------------------------")
    if data[1].get('Cisco-IOS-XE-lldp-oper:lldp-entries', {}).get('lldp-entry'):
        for i in data:
            if isinstance(i.get('Cisco-IOS-XE-lldp-oper:lldp-entries', {}).get('lldp-entry'), list):
                for a in i['Cisco-IOS-XE-lldp-oper:lldp-entries']['lldp-entry']:
                    print(f"{a['device-id']:<40}{a.get('local-interface'):<30}{a.get('connecting-interface'):<33}{',  '.join(list(dict.fromkeys(a.get('capabilities', {})))):<25}")
    else:
        print('No LLDP Neighbors or LLDP isnt Enabled\n')

def get_vlans(ip, port, username, password):
    """Gets device components /restconf/data/openconfig-platform:components"""

    data = []

    uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-vlan-oper:vlans"
    response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
    vlans = json.loads(response.text)

    for i in vlans.get('Cisco-IOS-XE-vlan-oper:vlans', {}).get('vlan', {}):
        try:
            if i.get('vlan-interfaces'):
                data.append({"id": i.get('id'), "name": i.get('name'), "status": i.get('status'), "interfaces": ", ".join([interface.get('interface') for interface in i.get('vlan-interfaces')])})
            else:
                data.append({"id": i.get('id'), "name": i.get('name'), "status": i.get('status'), "interfaces": ''})
        except TypeError:
            pass
    
    if data:
        print(f"\n{'Vlans':<30} {'Name':<39} {'Status':<50}{'Interfaces':<25}")
        print(f"--------------------------------------------------------------------------------------")
        for vlan_data in data:
            print(f"{vlan_data.get('id', {}):<30}{vlan_data.get('name', {}):<40} {vlan_data.get('status', {}):<30}{', '.join(vlan_data.get('interfaces', '').split(',')[0:4]):<20}")
            [_print_vlans_extended(index, vlan, vlan_data) for index, vlan in enumerate(vlan_data.get('interfaces').split(',')) if index != 0 and index % 4 == 0]
    else:
        print('No Vlans')

    return data

def _print_vlans_extended(index, b, vlan_data):
    """Prints vlans sideXside"""

    try:
        print(" " * 100 + b, vlan_data.get('interfaces', '').split(',')[index + 1], vlan_data.get('interfaces', '').split(',')[index + 2], vlan_data.get('interfaces', '').split(',')[index + 4])
    except IndexError:
        pass

if __name__ == '__main__':
  
  #Call your functions here
