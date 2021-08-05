from flask import Flask, request
import os
import json
import requests
import devicecalls as GetInterfaces


app = Flask(__name__)
headers_ios = {"Content-Type": 'application/yang-data+json', 'Accept': 'application/yang-data+json'}

@app.route('/login', methods=['POST', 'GET'])
def ios_xe_login() -> dict:
    print(request.json)
    auth_dict = {'status': 'null'}

    try:
        response = requests.get(
            f"https://{request.json.get('ip')}:{request.json.get('port')}/restconf/data/netconf-state/capabilities",
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


@app.route('/getinterfaces', methods=['POST', 'GET'])
def index():
    """This page displays device interface"""

    interfaces = GetInterfaces.get_interfaces(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'data': interfaces}

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

@app.route('/sfpstatus', methods=['POST', 'GET'])
def get_sfp_status():
    """This page displays device interface"""

    cpu_status = GetInterfaces.get_sfp_status(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'data': cpu_status}

@app.route('/bgpstatus', methods=['POST', 'GET'])
def get_bgp_status():
    """This page displays device interface"""

    cpu_status = GetInterfaces.get_bgp_status(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'data': cpu_status}


if __name__ == '__main__':
    app.run(debug=True)