
#!/bin/bash

#IF YOU DONT HAVE THE FOLLOWING DEPENDENCIES INSTALLED THEN RUN THIS SCRIPT, sudo bash install_dependencies
sudo apt update
INSTALL_PKGS="python3.10 nodejs npm openssl python3.8-venv pip"
for i in $INSTALL_PKGS; do
  sudo apt-get install -y  $i
done

sudo npm install pm2 -g
