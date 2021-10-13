#!/bin/bash

#!/bin/bash
#CERT Script Credit: https://gist.github.com/adamrunner/285746ca0f22b0f2e10192427e0b703c

#INSTALL APP DEPENDINCIES
npm install package.json -y

#START APP
pm2 --name XE-Ops start npm -- start

#CHANGE TO PYTHON DIRECTORY
cd "$(pwd)/BackEndModeules"

#START SSL CERT CREATION
DOMAIN=domainame
if [ -z "$DOMAIN" ]; then
  echo "Usage: $(basename $0) <domain>"
  exit 11
fi

fail_if_error() {
  [ $1 != 0 ] && {
    unset PASSPHRASE
    exit 10
  }
}

export PASSPHRASE=$(head -c 500 /dev/urandom | tr -dc a-z0-9A-Z | head -c 128; echo)

subj="
C=US
ST=MD
O=Blah
localityName=Bal
commonName=$DOMAIN
organizationalUnitName=XEOps
emailAddress=admin@x.com
"

openssl genrsa -des3 -out $DOMAIN.key -passout env:PASSPHRASE 2048
fail_if_error $?

openssl req \
    -new \
    -batch \
    -subj "$(echo -n "$subj" | tr "\n" "/")" \
    -key $DOMAIN.key \
    -out $DOMAIN.csr \
    -passin env:PASSPHRASE
fail_if_error $?
cp $DOMAIN.key $DOMAIN.key.org
fail_if_error $?

openssl rsa -in $DOMAIN.key.org -out $DOMAIN.key -passin env:PASSPHRASE
fail_if_error $?

openssl x509 -req -days 3650 -in $DOMAIN.csr -signkey $DOMAIN.key -out $DOMAIN.crt
fail_if_error $?

#CREATE PYTHON VIRTUAL ENVIRONMENT
python3.8 -m venv ios-xe-ops-env
#ACTIVATE ENVIRONMENT
source ios-xe-ops-env/bin/activate 
#INSTALL REQUIREMENTS
pip3 install -r requirements.txt 
#START API
python3 api_routes.py 
