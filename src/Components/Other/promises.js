import axios from 'axios';
const instance = axios.create();
instance.defaults.timeout = 3000;

export function Login(ip, username, password) {
    return new Promise(resolve => {
      resolve(axios.post('/login', {'ip': ip, 'username': username, 'password': password, 'port': 443},  { timeout: 30000 }))}
    );
  }

export function Token() {
    return new Promise(resolve => {
      resolve(axios.post('/token', {'username': 'test', 'password': 'password'}))}
    ); 
  }


export function PollInterfaces(ip, username, password, port) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.post('/getinterfaces', {'ip': ip, 'username': username, 'password': password, 'port': port}));
    }, 2000);
  });
}

export function GetCpuStatus(ip, username, password, port) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.post('/cpustatus', {'ip': ip, 'username': username, 'password': password, 'port': port}));
    }, 2000);
  });
}

export function GetHwdStatus(ip, username, password, port) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.post('/hardwarestatus', {'ip': ip, 'username': username, 'password': password, 'port': port}));
    }, 5000);
  });
}

export function GetComponents(ip, username, password, port) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.post('/getcomponents', {'ip': ip, 'username': username, 'password': password, 'port': port}));
    }, 5000);
  });
}

export function GetDpNeighbors(ip, username, password, port) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.post('/neighbors', {'ip': ip, 'username': username, 'password': password, 'port': port}));
    }, 5000);
  });
}

export function GetVlans(ip, username, password, port) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.post('/vlans', {'ip': ip, 'username': username, 'password': password, 'port': port}));
    }, 5000);
  });
}

export function GetLayerTwoInterfaces(ip, username, password, port) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.post('/layertwointerfaces', {'ip': ip, 'username': username, 'password': password, 'port': port}));
    }, 5000);
  });
}

export function GetEnvStatus(ip, username, password, port) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.post('/getenvirmoment', {'ip': ip, 'username': username, 'password': password, 'port': port}));
    }, 5000);
  });
}

export function GetSfpStatus(ip, username, password, port) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.post('/sfpstatus', {'ip': ip, 'username': username, 'password': password, 'port': port}));
    }, 5000);
  });
}

export function GeBgpStatus(ip, username, password, port) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.post('/bgpstatus', {'ip': ip, 'username': username, 'password': password, 'port': port}));
    }, 5000);
  });
}

export function PollIndexPage(ip, username, password, port, source) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.post('/pollIndexPage', {'ip': ip, 'username': username, 'password': password, 'port': port}));
    }, 5000);
  });
}

export function PollL2Page(ip, username, password, port) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.post('/pollL2Page', {'ip': ip, 'username': username, 'password': password, 'port': port}));
    }, 5000);
  });
}

export function ApiCheck() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.post('/apistatus'));
    }, 5000);
  });
}



 