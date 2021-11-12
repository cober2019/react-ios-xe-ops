#!/usr/bin/env python
import os
import sys
from getpass import getpass
from ansible import context
from ansible.parsing.dataloader import DataLoader
from ansible.vars.manager import VariableManager
from ansible.inventory.manager import InventoryManager
from ansible.executor.playbook_executor import PlaybookExecutor
from ansible.module_utils.common.collections import ImmutableDict

loader = DataLoader()
inventory = InventoryManager(loader=loader, sources='/home/appdeveloper/react-xe-ops-testing/BackEndModeules/AnsiblePlaybooks/inventory.yml')
variable_manager = VariableManager(loader=loader, inventory=inventory)

def interface_configurations(config_data) -> str:

  variable_manager._extra_vars = {"ip_interfaces": [
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
  playbook_path = '/home/appdeveloper/react-xe-ops-testing/BackEndModeules/AnsiblePlaybooks/intf_playbook.yml'

  if not os.path.exists(playbook_path):
      print('[ERROR] The playbook does not exist')
      sys.exit()

  context.CLIARGS = ImmutableDict(tags={},
                          listtags=False,
                          listtasks=False,
                          listhosts=False,
                          syntax=False,
                          connection='smart',
                          module_path=None,
                          forks=100,
                          #remote_user='developer',
                          # remote_pass=password,
                          private_key_file=None,
                          ssh_common_args=None,
                          ssh_extra_args=None,
                          sftp_extra_args=None,
                          scp_extra_args=None,
                          become=False, # 'True'
                          become_method=None, # 'sudo'
                          become_user=None, # 'root'
                          verbosity=True,
                          check=False,
                          start_at_task=None)

  results = execute_ansible_playbook(playbook_path, variable_manager)

  return results

def execute_ansible_playbook(playbook_path, variable_manager) -> str:
  play_ex = PlaybookExecutor(playbooks=[playbook_path], inventory=inventory, variable_manager=variable_manager, loader=loader, passwords={})
  results = play_ex.run()

  return results
