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

def get_sfp_status(ip, port, username, password):
    """Gets SFP/Slot information OPENCONFIG\n
        openconfig-platform:components/component"""

    ###### Future Use
    
    try:
        uri = f"https://{ip}:{port}/restconf/data/openconfig-platform:components/component"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))

        converted_json = json.loads(response.text)
        get_keys = dict.fromkeys(converted_json)
        parent_key = list(get_keys.keys())[0]

        if isinstance (converted_json[parent_key], list):
            for i in converted_json[parent_key]:
                print(f'\Slot {i.get("state").get("name")}\n=====================\n')
                print(i.get('state').get('name'))
                print(i.get('state').get('type'))
                print(i.get('state').get('id'))
                print(i.get('state').get('description'))
                print(i.get('state').get('mfg-name'))
                print(i.get('state').get('version'))
                print(i.get('state').get('serial-no'))
                print(i.get('state').get('part-no'))
                print(i.get('state').get('temperature').get('instant'))
                print(i.get('state').get('temperature').get('avg'))
                print(i.get('state').get('temperature').get('min'))
                print(i.get('state').get('temperature').get('max'))
                if isinstance(i.get('properties').get('property'), list):
                    for prop in i.get('properties').get('property'):
                        print('Properties\n=====================\n')
                        print(prop.get('name'))
                        print(prop.get('state').get('name'))
                        print(prop.get('state').get('value'))
                        print(prop.get('state').get('configurable'))
    except:
        print('Something Went Wrong\n\nPress Enter')
        input('')

def get_bgp_status(ip, port, username, password):
    """Gets BGP neighbor statuses IOS-XE\n
        Cisco-IOS-XE-bgp-oper:bgp-state-data/address-families/address-family"""

    ###### Future Use

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-bgp-oper:bgp-state-data/address-families/address-family"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))

        converted_json = json.loads(response.text)
        get_keys = dict.fromkeys(converted_json)
        parent_key = list(get_keys.keys())[0]

        if isinstance (converted_json[parent_key], list):
            for i in converted_json[parent_key]:
                print(i.get('local-as'))
                print(i.get('vrf-name'))
                print(i.get('router-id'))
                print(i.get('bgp-table-version'))
                print(i.get('routing-table-version'))
                print(i.get('prefixes').get('total-entries'))
                print(i.get('prefixes').get('memory-usage'))
                print(i.get('vrf-name'))
                print(i.get('path').get('total-entries'))
                print(i.get('path').get('memory-usage'))
                print(i.get('as-path').get('total-entries'))
                print(i.get('as-path').get('memory-usage'))
                print(i.get('route-map').get('total-entries'))
                print(i.get('route-map').get('memory-usage'))
                print(i.get('filter-list').get('total-entries'))
                print(i.get('filter-list').get('memory-usage'))
                print(i.get('activities').get('prefixes'))
                print(i.get('activities').get('paths'))
                print(i.get('activities').get('scan-interval'))
                print(i.get('total-memory'))
                print('Neighbors')
                if isinstance(i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary'), list):
                    for neighbor in i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary'):
                        print(neighbor.get('id'))
                        print(neighbor.get('bgp-version'))
                        print(neighbor.get('messages-received'))
                        print(neighbor.get('messages-sent'))
                        print(neighbor.get('table-version'))
                        print(neighbor.get('input-queue'))
                        print(neighbor.get('output-queue'))
                        print(neighbor.get('up-time'))
                        print(neighbor.get('state'))
                        print(neighbor.get('prefixes-received'))
                        print(neighbor.get('dynamically-configured'))
                        print(neighbor.get('as'))
                elif isinstance(i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary'), dict):
                    for neighbor in i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary'):
                        print(i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary').get('id'))
                        print(i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary').get('bgp-version'))
                        print(i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary').get('messages-received'))
                        print(i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary').get('messages-sent'))
                        print(i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary').get('table-version'))
                        print(i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary').get('input-queue'))
                        print(i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary').get('output-queue'))
                        print(i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary').get('up-time'))
                        print(i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary').get('state'))
                        print(i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary').get('prefixes-received'))
                        print(i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary').get('dynamically-configured'))
                        print(i.get('bgp-neighbor-summaries').get('bgp-neighbor-summary').get('as'))
    except:
        print('Something Went Wrong\n\nPress Enter')
        input('')

def get_envirmoment(ip="192.168.152.20", port="443", username='admin', password='C!sco!@#'):
    """Gets real time enviroment statistics using restconf/data/Cisco-IOS-XE-environment-oper:environment-sensors"""

    data = {}

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-environment-oper:environment-sensors"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        data = json.loads(response.text)
    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
        pass

    return data
