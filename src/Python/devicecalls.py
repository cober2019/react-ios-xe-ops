from json.decoder import JSONDecodeError
import requests
import json
import warnings
warnings.filterwarnings('ignore', message='Unverified HTTPS request')

headers = {"Content-Type": 'application/yang-data+json', 'Accept': 'application/yang-data+json'}

def get_interfaces(ip, port, username, password):
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
                for i in converted_json[parent_key]:
                    try:
                        for entry in i.get('arp-oper'):
                            if entry.get('interface') == interface.get('name'):
                                entry.pop('interface')
                                entry['time'] = entry.get('time').split('.')[0].strip('T00')
                                entries.append(entry)
                    except TypeError:
                        pass

                data[interface.get('name')] = {'interface': interface.get('name'), 'data': interface, 'arps': entries}
                
        except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
            for interface in interface_data:
                data[interface.get('name')] = {'interface': interface.get('name'), 'data': interface, 'arps': []}

    return data

def get_cpu_usages(ip, port, username, password):
    """Gets real time CPU statistics using restconf/data/Cisco-IOS-XE-process-cpu-oper:cpu-usage"""

    cpu_stats = {}
    memory_stats = {}

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-process-cpu-oper:cpu-usage/cpu-utilization"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        cpu_stats = json.loads(response.text)
    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
        pass

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-platform-software-oper:cisco-platform-software/control-processes/control-process"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        converted_json = json.loads(response.text)
        get_keys = dict.fromkeys(converted_json)
        parent_key = list(get_keys.keys())[0]
        memory_stats = converted_json[parent_key]
    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
        pass
    
    return cpu_stats, memory_stats

def get_hardware_status(ip, port, username, password):
    """Gets CPU memory statuses IOS-XE\n
        Cisco-IOS-XE-platform-software-oper:cisco-platform-software/control-processes/control-process"""

    ###### Future Use

    data = {}

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-platform-software-oper:cisco-platform-software/control-processes/control-process"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))

        converted_json = json.loads(response.text)
        get_keys = dict.fromkeys(converted_json)
        parent_key = list(get_keys.keys())[0]
        data = converted_json[parent_key]
    except:
        pass

    return data


def get_envirmoment(ip, port, username, password):
    """Gets real time enviroment statistics using restconf/data/Cisco-IOS-XE-environment-oper:environment-sensors"""

    data = {}

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-environment-oper:environment-sensors"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        data = json.loads(response.text)
    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
        pass

    return data

def get_components(ip, port, username, password):
    """Gets device components /restconf/data/openconfig-platform:components"""

    data = {}

    try:
        uri = f"https://{ip}:{port}/restconf/data/openconfig-platform:components"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        data = json.loads(response.text)
    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
        pass

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
        pass

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-lldp-oper:lldp-entries"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        converted_json = json.loads(response.text)
        data.append(converted_json)
    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
        pass

    return data


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
                data.append({"id": i.get('id'), "name": i.get('name'), "status": i.get('status'), "interfaces": []})
        except TypeError:
            pass
    
    return data

def get_switch(ip, port, username, password):
    """Gets device components /restconf/data/openconfig-platform:components"""

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
    
    for v in data.values():
        for i in v:
            if i[0].get('mode') == 'trunk':
                trunk.append(i[0])
            elif i[0].get('mode') == 'access':
                access.append(i[0])

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

