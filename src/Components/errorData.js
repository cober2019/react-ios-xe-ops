export const ErrorDataIndex = 
    [{}, [[]], [{'Cisco-IOS-XE-cdp-oper:cdp-neighbor-details': {'cdp-neighbor-detail': []}},{'Cisco-IOS-XE-lldp-oper:lldp-entries': {'lldp-entry': []}}],
    [{'Cisco-IOS-XE-process-cpu-oper:cpu-utilization': {'cpu-usage-processes': {'cpu-usage-process': []},'five-seconds': []}},[{'memory-stats': {'memory-status': []}}]],
    {'Cisco-IOS-XE-environment-oper:environment-sensors':{'environment-sensor': []}}]
    
export const ErrorDataL2 = [[[]]]

export const VlansData = [{'id': 1, 'name': 'You Should Never Use This One', 'status': 'active', 'interfaces': '4GigabitEthernet1/0/15, GigabitEthernet1/0/16, GigabitEthernet1/0/17, GigabitEthernet1/0/18, GigabitEthernet1/0/19, GigabitEthernet1/0/20, GigabitEthernet1/0/21, GigabitEthernet1/0/23, GigabitEthernet1/0/24'}, 
                    {'id': 2, 'name': 'Always In The Way (Security)', 'status': 'active', 'interfaces': ['GigabitEthernet1/0/1', 'GigabitEthernet1/0/2', 'GigabitEthernet1/0/3']}, 
                    {'id': 3, 'name': 'People Who Do Nothing', 'status': 'active', 'interfaces': ['GigabitEthernet1/0/4', 'GigabitEthernet1/0/7', 'GigabitEthernet1/0/8']}, 
                    {'id': 4, 'name': 'Help Desk', 'status': 'active', 'interfaces': ['GigabitEthernet1/0/9, GigabitEthernet1/0/10, GigabitEthernet1/0/11']}, 
                    {'id': 5, 'name': 'Cloud Net Engineers', 'status': 'active', 'interfaces': []},
                    {'id': 6, 'name': 'Real Net Engineers', 'status': 'active', 'interfaces': []},  
                    {'id': 1002, 'name': 'fddi-default', 'status': 'suspend', 'interfaces': []}, 
                    {'id': 1003, 'name': 'trcrf-default', 'status': 'suspend', 'interfaces': ['GigabitEthernet1/0/12', 'GigabitEthernet1/0/13', 'GigabitEthernet1/0/1']}, 
                    {'id': 1004, 'name': 'fddinet-default', 'status': 'suspend', 'interfaces': []}, 
                    {'id': 1005, 'name': 'trbrf-default', 'status': 'suspend', 'interfaces': []}]

export const TrunkData = [{'interface': 'GigabitEthernet1/0/14', 'vlans': 'all', 'status': 'up', 'mbpsOut': 10, 'mbpsIn': 9}, 
                            {'interface': 'GigabitEthernet1/0/15', 'vlans': '1-500', 'status': 'up', 'mbpsOut': 12, 'mbpsIn': 11}, 
                            {'interface': 'GigabitEthernet1/0/16', 'vlans': '501-1000', 'status': 'up', 'mbpsOut': 14, 'mbpsIn': 13}, 
                            {'interface': 'GigabitEthernet1/0/17', 'vlans': 'all', 'status': 'up', 'mbpsOut': 30, 'mbpsIn': 29}]


export const AccessData = [{'interface': 'GigabitEthernet1/0/18', 'vlan': '1', 'status': 'up', 'mbpsOut': 5, 'mbpsIn': 9}, 
                            {'interface': 'GigabitEthernet1/0/19', 'vlan': '2', 'status': 'up', 'mbpsOut': 2, 'mbpsIn': 1}, 
                            {'interface': 'GigabitEthernet1/0/20', 'vlan': '3', 'status': 'up', 'mbpsOut': 4, 'mbpsIn': 1}, 
                            {'interface': 'GigabitEthernet1/0/21', 'vlan': '4', 'status': 'up', 'mbpsOut': 3, 'mbpsIn': 9}]

export const DpData = [{'device-name': 'Deleware-switch', 'platform-name': 'Cisco 3850', 'port-id': 'GigabitEthernet1/0/11', 'duplex': 'full', 'capability': 'S', 'mgmt-address': '1.1.1.1', 'ip-address': '192.168.1.1', 'local-intf-name': 'GigabitEthernet1/0/14'}, 
                        {'device-name':  'Pa-switch', 'platform-name': 'Cisco 30000', 'port-id': 'GigabitEthernet1/0/12', 'duplex': 'half', 'capability': 'S', 'mgmt-address': '2.2.2.2', 'ip-address': '192.168.2.1', 'local-intf-name': 'GigabitEthernet1/0/15'}, 
                        {'device-name': 'WV-switch', 'platform-name': 'Cisco 20000', 'port-id': 'GigabitEthernet1/0/13', 'duplex': 'full', 'capability': 'S', 'mgmt-address': '3.3.3.3', 'ip-address': '192.168.3.1', 'local-intf-name': 'GigabitEthernet1/0/16'}, 
                        {'device-name': 'Virginia-switch', 'platform-name': 'Cisco 10000', 'port-id': 'GigabitEthernet1/0/14', 'duplex': 'full', 'capability': 'S', 'mgmt-address': '4.4.4.4', 'ip-address': '192.168.4.1', 'local-intf-name': 'GigabitEthernet1/0/17'}]

export const EnvData = [{'name': 'PEM Iout', 'location': 'P0', 'state': 'Normal', 'current-reading': 5, 'sensor-units': 'ampres'}, 
                        {'name': 'PEM Iout	', 'location': 'P1', 'state': 'Normal', 'current-reading': 5, 'sensor-units': 'ampres'}, 
                        {'name': 'Cpu-2', 'location': 'R0', 'state': 'Normal', 'current-reading': 5, 'sensor-units': 'volts-dc'}, 
                        {'name': 'Cpu-1', 'location': 'R1', 'state': 'Normal', 'current-reading': 5, 'sensor-units': 'volts-dc'}]