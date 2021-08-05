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
    setTimeout(() => {
      resolve(axios.post('/cpustatus', {'ip': ip, 'username': username, 'password': password, 'port': port}));
    }, 5000);
  });
}

 