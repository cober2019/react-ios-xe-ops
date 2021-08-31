from flask import Flask, request
import os
import json
import requests
import devicecalls as GetInterfaces


app = Flask(__name__)
headers_ios = {"Content-Type": 'application/yang-data+json', 'Accept': 'application/yang-data+json'}

@app.route('/login', methods=['POST', 'GET'])
def ios_xe_login() -> dict:

    auth_dict = {'status': 'null'}

    try:
        response = requests.get(f"https://{request.json.get('ip')}:{request.json.get('port')}/restconf/data/netconf-state/capabilities",
            headers=headers_ios, verify=False, auth=(request.json.get('username'), request.json.get('password')))

        if response.status_code == 200:
            auth_dict['status'] = 200
        elif response.status_code == 400:
            auth_dict['status'] = 400
        elif response.status_code == 401:
            auth_dict['status'] = 401
        elif response.status_code == 404:
            auth_dict['status'] = 404
        elif response.status_code == 204:
            auth_dict['status'] = 204
        elif response.status_code == 500:
            auth_dict['status'] = 500

    except (json.decoder.JSONDecodeError, requests.exceptions.ConnectionError, requests.exceptions.InvalidURL,
            UnboundLocalError):
        auth_dict['status'] = 500

    return auth_dict


@app.route('/pollIndexPage', methods=['POST', 'GET'])
def index_page():
    """This page displays device interface"""

    interfaces = GetInterfaces.get_interfaces(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    cpu_status = GetInterfaces.get_cpu_usages(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    env_status = GetInterfaces.get_envirmoment(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    neighbors = GetInterfaces.get_dp_neighbors(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    arps = GetInterfaces.get_arps(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    print(arps)

    return {'interfaces': interfaces, 'arps': arps, 'cpu': cpu_status[0], 'env': env_status, 'dp': neighbors, 'mem': cpu_status[1]}

@app.route('/pollL2Page', methods=['POST', 'GET'])
def layer_2__page():
    """This page displays device interface"""

    interfaces = GetInterfaces.get_switch(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    vlans = GetInterfaces.get_vlans(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    neighbors = GetInterfaces.get_dp_neighbors(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'trunks': interfaces[0], 'access': interfaces[1], 'dpNeighbors': neighbors, 'vlans': vlans}

@app.route('/getinterfaces', methods=['POST', 'GET'])
def index():
    """This page displays device interface"""

    interfaces = GetInterfaces.get_interfaces(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'interfaces': interfaces[0], 'arps': interfaces[1]}

@app.route('/getinterfacestats', methods=['POST', 'GET'])
def interface_stats():
    """This page displays device interface"""

    interface_stats = GetInterfaces.get_interface_stats(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'), request.json.get('interface'))

    return {'data': interface_stats}

@app.route('/cpustatus', methods=['POST', 'GET'])
def get_cpu_status():
    """This page displays device interface"""

    cpu_status = GetInterfaces.get_cpu_usages(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'data': cpu_status[0], 'mem': cpu_status[1]}

@app.route('/hardwarestatus', methods=['POST', 'GET'])
def get_hardware_status():
    """This page displays device interface"""

    cpu_status = GetInterfaces.get_hardware_status(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'data': cpu_status}

@app.route('/getenvirmoment', methods=['POST', 'GET'])
def get_enviroment():
    """This page displays device interface"""

    env_status = GetInterfaces.get_envirmoment(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'data': env_status}

@app.route('/getcomponents', methods=['POST', 'GET'])
def get_components():
    """This page displays device interface"""

    components = GetInterfaces.get_components(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'data': components}

@app.route('/neighbors', methods=['POST', 'GET'])
def get_dp_neigh():
    """This page displays device interface"""

    neighbors = GetInterfaces.get_dp_neighbors(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'data': neighbors}


@app.route('/vlans', methods=['POST', 'GET'])
def get_vlans():
    """This page displays device interface"""

    vlans = GetInterfaces.get_vlans(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'data': vlans}

@app.route('/layertwointerfaces', methods=['POST', 'GET'])
def get_layertwo_interfaces():
    """This page displays device interface"""

    interfaces = GetInterfaces.get_switch(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'trunks': interfaces[0], 'access': interfaces[1]}

@app.route('/bgpstatus', methods=['POST', 'GET'])
def get_bgp_status():
    """This page displays device interface"""

    cpu_status = GetInterfaces.get_bgp_status(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'data': cpu_status}

@app.route('/apistatus', methods=['POST', 'GET'])
def get_api_status():
    """This page displays device interface"""

    return "<h4>API Is Up</h4>"

if __name__ == '__main__':
    app.run(debug=True)