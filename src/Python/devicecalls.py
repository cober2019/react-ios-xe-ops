from json.decoder import JSONDecodeError
import requests
import json

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
        data = json.loads(response.text)
        data.append(converted_json)
    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
        pass

    return data

