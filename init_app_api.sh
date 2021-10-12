#!/bin/bash


npm install package.json -y
pm2 --name XE-Ops start npm -- start
cd "$(pwd)/BackEndModeules"
python3.8 -m venv ios-xe-ops-env
source ios-xe-ops-env/bin/activate 
pip3 install -r requirements.txt 
python3 api_routes.py 


