import axios from 'axios';

export function Login(ip, username, password, port) {
    return new Promise(resolve => {
      resolve(axios.post('/login', {'ip': ip, 'username': username, 'password': password, 'port': port}))}
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
    setInterval(() => {
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

 