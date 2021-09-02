from json.decoder import JSONDecodeError
import classmaps 
import requests
import json
import warnings
import random

warnings.filterwarnings('ignore', message='Unverified HTTPS request')

headers = {"Content-Type": 'application/yang-data+json', 'Accept': 'application/yang-data+json'}

def _check_api_error(response) -> bool:

    is_error = False

    if list(response.keys())[0] == 'errors':
        is_error = True
    
    return is_error

def get_arps(ip, port, username, password) -> list:
    """Collects arp for the matching"""

    entries = []

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-arp-oper:arp-data/arp-vrf"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        arp_entries = json.loads(response.text, strict=False)

        check_error = _check_api_error(arp_entries)

        if check_error:
            raise AttributeError

        try:
            for i in  arp_entries.get('Cisco-IOS-XE-arp-oper:arp-vrf'):
                for entry in i.get('arp-oper'):
                    entry.pop('interface')
                    entry['vrf'] = i.get('vrf')
                    entry['time'] = entry.get('time').split('.')[0].strip('T00')
                    entries.append(entry)
        except (TypeError, AttributeError):
            pass

    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL, AttributeError):
        entries = [{}]

    return entries


def get_interfaces(ip, port, username, password) -> dict:
    """Gets real time interface statistics using IOS-XE\n
        Cisco-IOS-XE-interfaces-oper:interfaces and live arp data via Cisco-IOS-XE-arp-oper:arp-data/arp-vrf"""

    data = {}
    interface_data = {}

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-interfaces-oper:interfaces"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        interface_data = json.loads(response.text).get('Cisco-IOS-XE-interfaces-oper:interfaces').get('interface')
        check_error = _check_api_error(interface_data)

        if check_error:
            raise AttributeError

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
                #Collect inter qos statistics. Commence policy breakdown
                qos_stats = collect_qos_stats(interface, ip, port, username, password)
                convert_bandwidth = convert_to_mbps(interface)
                data[interface.get('name')] = {'interface': interface.get('name'), 'data': convert_bandwidth, 'qos': qos_stats}
                
        except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL):
            for interface in interface_data:
                convert_bandwidth = convert_to_mbps(interface)
                data[interface.get('name')] = {'interface': interface.get('name'), 'data': convert_bandwidth, 'qos': [[]]}

    return data

def collect_qos_stats(interface, ip, port, username, password) -> list:
    """Collect interface service policies, breaks down policy."""

    qos = []

    # The following code will compare two sets of data. Interface queue stats and service policy config. Unfortunently we cant get this data as one

    for policy in interface.get('diffserv-info', {}):
        try:
            #Get qos policy map details using rest and a name filter in out url path
            uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-native:native/policy/policy-map={policy.get('policy-name')}"
            response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
            check_error = _check_api_error(json.loads(response.text))

            if check_error:
                raise AttributeError

            #Get policy detials. Type, Allocation etc.
            allocation = _get_qos_bandwidth(json.loads(response.text))

            if not policy.get('diffserv-target-classifier-stats'):
                qos = []
            elif isinstance(policy.get('diffserv-target-classifier-stats'), list):
                #Use list comp to get out queue details, also map other details

                if not allocation:
                    qos = []
                elif len(allocation) == 1:
                    qos = {'interface_policy': policy.get('policy-name', {}), 'allocation': allocation[0].get('allocation', {}), 
                    'direction': policy.get('direction', {}).split('-')[1], 'queues': _map_queues(allocation[0], policy)}
                else:
                    qos = [
                        
                        {'interface_policy': policy.get('policy-name', {}), 'allocation': i.get('allocation', {}), 
                        'direction': policy.get('direction', {}).split('-')[1], 'queues': _map_queues(i, policy)}
                        
                        for i in allocation
                    
                        ]
        except AttributeError:
             pass

    return qos

def _get_qos_bandwidth(policy) -> list:
    """Break down each child policy"""

    parent_queues = []

    #Get parent policy actions and action type. ie.e bandwdith, service-policy, fair-queue etc.
    for queue in policy.get('Cisco-IOS-XE-policy:policy-map', {}).get('class', {}):
        try:
            if isinstance(queue.get('action-list', {}), list):
                allocation = [_allocation_type(action) for action in queue.get('action-list', {})]
                print(allocation)
                if len(allocation) == 1 and str(allocation) != '[(\'---\', \'---\')]':
                    parent_queues.append({'queue': queue.get('name'), 'allocation': allocation[0][0], 'type': allocation[0][1]})
                elif len(allocation) == 2:
                    parent_queues.append({'queue': queue.get('name'), 'allocation': allocation[0][0], 'type': allocation[1]})
        except IndexError:
            pass

    return parent_queues

def _allocation_type(action) -> tuple:
    """Get details of child policy"""

    allocation = '---'
    action_type = '---'

    if action.get("action-type",{}) == 'shape':
        if 'bit-rate' in action.get('shape',{}).get('average',{}):
            allocation = str(round(int(action.get("shape",{}).get("average",{}).get("bit-rate",{})) / 1e+6)) + " Mbps"
        elif 'percent' in action.get('shape',{}).get('average'):
            allocation = action.get("shape",{}).get("average",{}).get("percent",{}) + "%"

    elif action.get("action-type",{}) == 'bandwidth':
        if 'kilo-bits' in action.get('bandwidth', {}):
            allocation = str(round(int(action.get("bandwidth",{}).get("kilo-bits",{})) * 1000 / 1e+6)) + " Mbps"
        elif 'percent' in action.get('bandwidth', {}):
            allocation = action.get("bandwidth",{}).get("percent",{}) + '%'

    if action.get("action-type",{}) == 'service-policy':
        action_type = 'service-policy'
    elif action.get("action-type",{}) == 'fair-queue':
        action_type = 'fair-queue'

    return allocation, action_type
    
def _map_queues(i, policy) -> list:
    
    queues = []

    # Check if policy type is service policy. When then can get our queue detiials
    if 'service-policy' in i.get('type'):
        for queue in policy.get('diffserv-target-classifier-stats', {}):
            #Parent path provided allows use to check if the queue is a child queue. 1st path part is Parent Policy, second is a paren queue, anything after is child
            if len(queue.get('parent-path').split()) != 2:
                queues.append({'queue-name': queue.get('classifier-entry-name'), 'parent': " ".join(queue.get('parent-path').split(" ")[0:2]),
                'rate': queue.get('classifier-entry-stats').get('classified-rate'), 'bytes': queue.get('classifier-entry-stats').get('classified-bytes'),
                'pkts': queue.get('classifier-entry-stats').get('classified-pkts'), 'drops': queue.get('queuing-stats').get('drop-bytes')})
            elif len(queue.get('parent-path').split()) == 2 and queue.get('classifier-entry-name') == i.get('queue'):
                queues.append({'queue-name': f'Parent Queue: {queue.get("classifier-entry-name")}'})

    elif '---' in i.get('type'):
        # This maps if the queue is not service policy. A single queue with no child
        queues = [
                    {'queue-name': f'Parent Queue: {queue.get("classifier-entry-name")}'} 
                    for queue in policy.get('diffserv-target-classifier-stats', {}) 
                    if len(queue.get('parent-path').split()) == 2 and queue.get('classifier-entry-name') == i.get('queue')
                ]
    return queues


def convert_to_mbps(interface):
    """Convert Kbps to Mbps"""

    interface['statistics']['tx-kbps'] = random.randint(0,9)
    interface['statistics']['rx-kbps'] = random.randint(0,9)
    if interface['oper-status'] == 'if-oper-state-ready':
        interface['oper-status'] = 'up'
    else:
        interface['oper-status'] = 'down'

    return interface

def get_cpu_usages(ip, port, username, password):
    """Gets real time CPU statistics using restconf/data/Cisco-IOS-XE-process-cpu-oper:cpu-usage"""

    cpu_stats = {}
    memory_stats = {}

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-process-cpu-oper:cpu-usage/cpu-utilization"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        cpu_stats = json.loads(response.text)
        check_error = _check_api_error(cpu_stats)

        if check_error:
            raise AttributeError

    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
        cpu_stats = {'Cisco-IOS-XE-process-cpu-oper:cpu-utilization': {'cpu-usage-processes': {'cpu-usage-process': []}},'five-seconds': []}

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-platform-software-oper:cisco-platform-software/control-processes/control-process"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        memory_stats = json.loads(response.text)
        print(memory_stats.get('Cisco-IOS-XE-platform-software-oper:control-process')[0].get('memory-stats', {}))

        check_error = _check_api_error(cpu_stats)

        if check_error:
            raise AttributeError

        memory_stats = memory_stats.get('Cisco-IOS-XE-platform-software-oper:control-process')[0].get('memory-stats', {})

    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError) as e:
        print(e)
        memory_stats = {'memory-status': '?'}
    
    return cpu_stats, memory_stats

def get_hardware_status(ip, port, username, password):
    """Gets CPU memory statuses IOS-XE\n
        Cisco-IOS-XE-platform-software-oper:cisco-platform-software/control-processes/control-process"""

    ###### Future Use

    data = {}

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-platform-software-oper:cisco-platform-software/control-processes/control-process"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        hardware_status = json.loads(response.text)

        check_error = _check_api_error(hardware_status)
        
        if check_error:
            raise AttributeError

        get_keys = dict.fromkeys(hardware_status)
        parent_key = list(get_keys.keys())[0]
        data = hardware_status[parent_key]

    except AttributeError:
        pass

    return data


def get_envirmoment(ip, port, username, password):
    """Gets real time enviroment statistics using restconf/data/Cisco-IOS-XE-environment-oper:environment-sensors"""

    env_data = {}

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-environment-oper:environment-sensors"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        env_data = json.loads(response.text)

        check_error = _check_api_error(env_data)
        
        if check_error:
            raise AttributeError

    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
        env_data = {'Cisco-IOS-XE-environment-oper:environment-sensors': {'environment-sensor': []}}

    return env_data

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

def get_bridge(ip, port, username, password):
    """Gets device components /restconf/data/openconfig-platform:components"""

    mac_table = []

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-matm-oper:matm-oper-data"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        data = json.loads(response.text)
        for i in data['Cisco-IOS-XE-matm-oper:matm-oper-data']['matm-table']:
            if i.get('matm-mac-entry', {}):
                [mac_table.append(i) for i in i.get('matm-mac-entry', {})]
                
    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
        pass

    return mac_table


def get_dp_neighbors(ip, port, username, password):
    """Gets device components restconf/data/Cisco-IOS-XE-cdp-oper:cdp-neighbor-details"""

    data = []

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-cdp-oper:cdp-neighbor-details"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        cdp_data = json.loads(response.text)

        check_error = _check_api_error(cdp_data)
        
        if check_error:
            raise AttributeError

        data.append(cdp_data)

    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
         data.append({'Cisco-IOS-XE-cdp-oper:cdp-neighbor-details': {'cdp-neighbor-detail': []}})

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-lldp-oper:lldp-entries"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        lldp_data = json.loads(response.text)

        check_error = _check_api_error(lldp_data)
        
        if check_error:
            raise AttributeError

        data.append(lldp_data)

    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
        data.append({'Cisco-IOS-XE-lldp-oper:lldp-entries': {'lldp-entry': []}})

    return data


def get_vlans(ip, port, username, password):
    """Gets device components /restconf/data/openconfig-platform:components"""

    vlan_data = []

    try:
        uri = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-vlan-oper:vlans"
        response = requests.get(uri, headers=headers, verify=False, auth=(username, password))
        vlans = json.loads(response.text)

        check_error = _check_api_error(vlans)
        
        if check_error:
            raise AttributeError

        for i in vlans.get('Cisco-IOS-XE-vlan-oper:vlans', {}).get('vlan', {}):
            try:
                if i.get('vlan-interfaces'):
                    vlan_data.append({"id": i.get('id'), "name": i.get('name'), "status": i.get('status'), "interfaces": ", ".join([interface.get('interface') for interface in i.get('vlan-interfaces')])})
                else:
                    vlan_data.append({"id": i.get('id'), "name": i.get('name'), "status": i.get('status'), "interfaces": []})
            except TypeError:
                pass

    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,UnboundLocalError, AttributeError):
         pass
        
    return vlan_data

def get_switch(ip, port, username, password):
    """Gets device components /restconf/data/openconfig-platform:components"""

    data = {}
    trunk =[]
    access = []
    try:
        interfaces_configs = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-native:native/interface"
        interface_status = f"https://{ip}:{port}/restconf/data/Cisco-IOS-XE-interfaces-oper:interfaces"
        config_response = requests.get(interfaces_configs, headers=headers, verify=False, auth=(username, password))
        config_json = json.loads(config_response.text)
        check_error = _check_api_error(config_json)
        
        if check_error:
            raise AttributeError

        stats_response = requests.get(interface_status, headers=headers, verify=False, auth=(username, password))
        interface_stats = json.loads(stats_response.text)
        check_error = _check_api_error(interface_stats)
        
        if check_error:
            raise AttributeError

        for interface, v in config_json['Cisco-IOS-XE-native:interface'].items():
            if isinstance(v, list):
                mapped = [map_switchports(config, interface, interface_stats) for config in v]
                data[interface] = list(mapped)

    except (JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL, KeyError, AttributeError):
        pass

    if data:
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
        'mbpsOut': random.randint(0,100), 'mbpsIn': random.randint(0,100)})

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

        data.append({'mode': 'trunk', 'interface': complete_interface, 'vlans': trunked_vlans, 'native': native, 'status': statistics['oper-status'], 'speed': statistics['speed'], 
        'mbpsOut': int(statistics['statistics']['tx-kbps'])/1000, 'mbpsIn': int(statistics['statistics']['rx-kbps'])/1000})
    else:
        data.append({'mode': None, 'interface': complete_interface, 'status': statistics['oper-status'], 
        'mbpsOut': int(statistics['statistics']['tx-kbps'])/1000, 'mbpsIn': int(statistics['statistics']['rx-kbps'])/1000})

    return data

