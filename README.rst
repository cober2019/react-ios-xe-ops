.. image:: https://app.travis-ci.com/cober2019/react-ios-xe-ops.svg?branch=main
    :target: -
.. image:: https://img.shields.io/badge/npm-16.14.12-blue
    :target: -
.. image:: https://img.shields.io/badge/Node-stable-blue
    :target: -

IOS-XE-Ops
============

View operational and config data from devices running Cisco IOS-Xe software. A demo is available at http://13.92.41.254:3000/

**Snapshots**

.. image:: https://github.com/cober2019/react-ios-xe-ops/blob/main/images/xeopsprod-env.PNG


**Notes:**
    
    |    -Switches are slower to poll than routers
    |    -Some YANG models may not be compatible with your device. If so, data is collected via Netmiko
    |    -Views are conditionally rendered which means so some views wont display.
    |    -Sometimes CPU data for CSRs will error. If so, it will be represented with 'Err'
    |    -Page data will be cached for 5 minutes per device. This means if you switch pages or log into another device, the page will load what was polled last for that device/page. Beats a loading page!
    |    -Login timeout set to 30 seconds
Available Views:
-----------------

**Interfaces:**
    
    |    -Layer Two and Layer Three
    |    -Arps
    |    -QoS
**Neighbors:**
    
    |    -DP Neighbors
    |    -OSPF Neighbors
    |    -BGP Neighbors
    
**Routing:**

    |    -OSPF
    |    -BGP
    |    -Routing Table (Flapping Route Checker)
    
**IP SLAs:**
    
    |    -Check current IP SLA statuses
    
**Environment:**
    
    |    -CPU/Memory statuse
    |    -Sensor statuses
    |    -SFP statuses
    |    -POE port statuses
    
**DMVPN:**
    
    |    -Tunnel statuses
    |    -Peer statuses
    |    -Public IP resolution
    |    -DMVPN topology visualization
    
**LayerTwo:**
    
    |    -Vlans
    |    -Trunks
    |    -Spanning-tree
    |
**Rest Viewer:**
    
    |    -View all device data in JSON format
    
        

Requirements:
--------------

    |   -Check to see if your device is compatible to use this program. Use the following instructions - https://developer.cisco.com/docs/ios-xe/#!enabling-restconf-on-ios-xe

Install
--------

|   You can install code on either windows or linux. Whichever one you choose you will need to install the following dependencies:
    |
    |   **If you don't have the following dependencies install, execute:  "sudo bash install_dependencies.sh"**
    |
    |   -NPM && Node.js - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
    |   -Python: Windows - https://www.python.org/downloads/, Linux: https://docs.python-guide.org/starting/install3/linux/
    |   -Open SSL
    |

**Once Dependecies Are Installed:**
    |
    |   **Linux:**
    |   
    |   **Note: If you're using windows 10, you can use built-in Ubuntu** 
    |   
    |   1. Clone this repo to you server and navigate to the /react-ios-xe-ops (root) directory. 
    |   2. Execute command "sudo bash init_app_routes" which will take care of everything below. When running the script, SSL certs will be created for app to api security. TLSv1.3 for transport.
    |
    |   **If you want to manualy install then continue with these steps:**
    |
    |   2. Located package.json and execute code "npm install package.json"
    |   3. Once packages are installed, execute code "node server.js&"
    |   4. Navigate to 127.0.0.1:3000
    |   5. Create a virtual environment by executing "python3.8 -m venv ios-xe-ops-env" and activate the env using "source ios-xe-ops-env/bin/activate"
    |   6. Install python modules using pip "pip install -r requirements.txt"
    |   7. Start the API using "Python3 api_routes.py"
    |   8. Go back to the web app and login to your device
    |
    |   **Windows: Non-Prod build for now**
    |
    |   1. Clone this repo to you server and navigate to the /react-ios-xe-ops-main directory. (**Directory Name Could Change!**)
    |   2. Located package.json and execute code "npm install package.json"
    |   3. Once packages are installed, execute code "npm start". This will automatically open a browser tab with the app.
    |   4. You can copy/install requirements.txt globally from your Windows user profile - C:\Users\**YOUR_USERNAME**\AppData\Local\Programs\Python\Python38\Scripts. From CMD run "pip install -r requirements.txt"
    |   5. Navigate to the repo react-ios-xe-ops-main/BackEndModeules and double-click the api_routes.py
    |
    |   **IF YOU CREATE VIRTUAL ENVIRONMENTS FROM YOUR IDE YOU CAN INSTALL REQUIREMENTS.TXT FROM THERE AS WELL.**







