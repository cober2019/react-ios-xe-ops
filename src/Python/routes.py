from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
import os
import json
import requests
import devicecalls as GetInterfaces
import ssl

headers_ios = {"Content-Type": 'application/yang-data+json', 'Accept': 'application/yang-data+json'}

# Create certs in api directory befor unmarking
# ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
# ctx.load_cert_chain(f'{os.getcwd()}/src/certificate.crt', f'{os.getcwd()}/src/privatekey.key')

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "CHANGE ME!!!" 
jwt = JWTManager(app)

def parse_config(config, parent_key):
    """Collect config and all keys for next config options"""

    leafs = []
    data = []
    if isinstance(config[parent_key], list):
        lists = [k for k in config[parent_key]]
        leafs = [leaf for leaf in lists[0].keys()]
        data = [i.get(leafs[0]) for i in lists]
    elif isinstance(config[parent_key], dict):
        data = [k for k in config[parent_key].keys()]

    return data, leafs

@app.route('/token', methods=['POST', 'GET'])
def token() -> dict:
    token = create_access_token(identity=request.json.get('username'))
    return jsonify(token)

@app.route('/login', methods=['POST', 'GET'])
@jwt_required()
def ios_xe_login() -> dict:
    print(request.json.get('headers'))

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
@jwt_required()
def index_page():
    """This page displays device interface"""

    interfaces = GetInterfaces.get_interfaces(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    cpu_status = GetInterfaces.get_cpu_usages(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    env_status = GetInterfaces.get_envirmoment(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    neighbors = GetInterfaces.get_dp_neighbors(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    arps = GetInterfaces.get_arps(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'interfaces': interfaces, 'arps': arps, 'cpu': cpu_status[0], 'env': env_status, 'dp': neighbors, 'mem': cpu_status[1]}

@app.route('/pollL2Page', methods=['POST', 'GET'])
@jwt_required()
def layer_2__page():
    """This page displays device interface"""

    interfaces = GetInterfaces.get_switch(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    vlans = GetInterfaces.get_vlans(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    neighbors = GetInterfaces.get_dp_neighbors(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    mac_addresses = GetInterfaces.get_bridge(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    span_table = GetInterfaces.get_span_tree(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))

    return {'trunks': interfaces[0], 'access': interfaces[1], 'dpNeighbors': neighbors, 'vlans': vlans, 'mac_addresses': mac_addresses, 'span': span_table}

@app.route('/pollRouting', methods=['POST', 'GET'])
@jwt_required()
def routing_page():
    """This page displays device interface"""

    ospf = GetInterfaces.get_ospf(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
    bgp = GetInterfaces.get_bgp_status(request.json.get('ip'), request.json.get('port'), request.json.get('username'), request.json.get('password'))
  
    return {'ospf': ospf[0], 'ospf_ints': ospf[1], 'bgp': bgp[0], 'bgpDetails': bgp[1]}

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

@app.route('/query', methods=['POST', 'GET'])
@jwt_required()
def device_query() -> dict:

    response_dict = {} 

    response = requests.get(request.json.get('url'), 
                            headers=headers_ios, verify=False,
                            auth=(request.json.get('username'),
                            request.json.get('password')))
    
    if response.status_code == 200:
        try:
            converted_json = json.loads(response.text, strict=False)
            get_keys = dict.fromkeys(converted_json)
            parent_key = list(get_keys.keys())[0]
            config = parse_config(converted_json, parent_key)
            response_dict['status'] = 200
            response_dict['data'] = config[0]
            response_dict['leafs'] = config[1]
            response_dict['parent'] = list(get_keys.keys())[0]
            response_dict['config'] = response.text
        except json.decoder.JSONDecodeError as error:
            response_dict['status'] = 500
    elif response.status_code == 204:
        response_dict['status'] = 200
    elif response.status_code == 401:
        response_dict['status'] = 401
    elif response.status_code == 404:
        response_dict['status'] = 404

    return response_dict

if __name__ == '__main__':
    # ssl_context=ctx <-- Add to app.run as argument
    app.run(debug=True)
