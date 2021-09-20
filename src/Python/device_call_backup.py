"""Helper functions that get output via netmiko"""

from netmiko import ConnectHandler, ssh_exception
from paramiko.ssh_exception import PasswordRequiredException
import ipapi 

def send_command(command, username, password, host) -> list:
    """Logs into device and returns a connection object to the caller. """

    response = []
    credentials = {
        'device_type': 'cisco_ios',
        'host': host,
        'username': username,
        'password': password,
        'port': 22,
        "fast_cli": False,
        'session_log': 'my_file.out'}

    try:
        with ConnectHandler(**credentials) as connection:
            response = connection.send_command(command)
    except (ssh_exception.AuthenticationException, EOFError, ssh_exception.NetmikoTimeoutException, PasswordRequiredException) as e:
        print(e)
        pass
    
    return response


def get_hsrp_status(username, password, host) -> list:
    """Gets HSRP operation data"""

    hsrp_data = []
    cli = send_command('show dmvpn | b Interface', username, password, host)

    if cli:
        for interface in send_command('show standby brief | ex Interface', username, password, host).splitlines():
            if len(interface.split()) == 0:
                continue
            else:
                try:
                    hsrp_data.append({'vlanInt': interface.split()[0], 'group': interface.split()[1], 'priority': interface.split()[2], 'state':  interface.split()[4],
                    'active': interface.split()[5], 'standby': interface.split()[6], 'vip':  interface.split()[7]}) 
                except IndexError:
                    pass

    return hsrp_data

def get_dmvpn(username, password, host) -> tuple:
    """Gets dmvpn peers, attributes, and statuses"""

    dmvpn_data = []
    nbma_location = []
    cli = send_command('show dmvpn | b Interface', username, password, host)

    if cli:
        for line in cli.splitlines():
            data = line.split()
            if data == 0 or '-' in line or '#' in line:
                continue
            elif len(line.split()) == 6:

                try:
                    nbma_location.append(ipapi.location(data[1], key=None))
                except ipapi.exceptions.RateLimited:
                    pass

                dmvpn_data.append({'peerNbma': data[1], 'peerTunnel': data[2], 'state': data[3], 'upTime': data[4], 'attrb': data[5]})

    return dmvpn_data, nbma_location




