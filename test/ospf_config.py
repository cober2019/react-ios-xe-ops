#!/usr/bin/python3

import ansible_runner
import json

def playbook_runner(config_data) -> dict:
    print(config_data)
    """
    Run the playbook defined in the function,
    extravars will come via config_date dict 
    variable. 
    """
    
    runner = ansible_runner.interface.run(
                private_data_dir='/home/appdeveloper/react-xe-ops-testing/BackEndModeules/AnsiblePlaybooks/',
                playbook='ospf_config.yml',
                inventory='inventory.yml',
                extravars = {"ospf": 
                                {
                                 "router_id": config_data.get('routerId'),
				 "process_id": config_data.get('process'),
                                 "network": config_data.get('network'),
                                 "wildcard": config_data.get('wildcard'),
				 "area": config_data.get('area'),
				 "area_type": config_data.get('areaType'),
				 "vrf": config_data.get('vrf'),

				}
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
            if 'ospf_config.updates' in resp:
                updates = resp['ospf_config.updates']
                msg_data = json.dumps(updates, indent=4) 
            if 'msg' in resp:
                updates = resp['msg']
                msg_data = json.dumps(updates, indent=4) 

    if job_status == 'successful':
        status = f"{host} has been configured successfully."

    if job_status == 'failed':
        status = f"[Error]: {host} changes are failed"

    return {"config_data": updates, "status": job_status}
