#!/bin/bash

git clone https://github.com/cober2019/react-ios-xe-ops.git
npm install package.json -y
pm2 --name XE-Ops start npm -- start
cd "$(pwd)/BackEndModeules"
python3.8 -m venv ios-xe-ops-envv 
source ios-xe-ops-envv/bin/activate 
pip3 install -r requirements.txt 
python3 api_routes.py 


