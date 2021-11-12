#!/usr/bin/env python

import ansible_runner
import json

def playbook_runner(config_data) -> dict:
    """
    Run the playbook defined in the function,
    extravars will come via config_date dict 
    variable. 
    """
    runner = ansible_runner.run(
                private_data_dir='/home/appdeveloper/react-xe-ops-testing/BackEndModeules/AnsiblePlaybooks/',
                playbook='intf_playbook.yml',
                inventory='inventory.yml',
                envvars='',
                extravars= {"ip_interfaces": [
                           {
                            "intf_name": config_data.get('name'),
                            "intf_description": config_data.get('description'),
                            "intf_ipv4": config_data.get('ip'),
                            "intf_ipv4_mask": config_data.get('mask'),
                            "intf_speed": config_data.get('speed'),
                            "port_status": config_data.get('portStatus')
                            }
                           ]
                          }       
                         )

    stdout = runner.stdout.read()
    stdout_lines = runner.stdout.readlines()
    events = list(runner.events)
    stats = runner.stats
    job_status = runner.status

    # print(json.dumps(stats, indent=4))
    # print(job_status)

    for event in runner.events:
        event_data = event['event_data']
        if 'host' in event_data:
            host = event_data['host']

    for event in runner.events:
        event_data = event['event_data']
        if 'res' in event_data:
            resp = event_data['res']
            if 'intf_config.updates' in resp:
                updates = resp['intf_config.updates']
                msg_data = json.dumps(updates, indent=4) ## green
            if 'msg' in resp:
                updates = resp['msg']
                msg_data = json.dumps(updates, indent=4) ## red

    if job_status == 'successful':
        status = f"{host} has been configured successfully." # green

    if job_status == 'failed':
        status = f"[Error]: {host} changes are failed"

    return {"config_data": updates, "status": job_status}

