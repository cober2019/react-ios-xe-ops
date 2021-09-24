import axios from 'axios';

export function Login(ip, username, password, port) {
  return new Promise(resolve => {
    resolve(axios.post('/login', {'ip': ip, 'username': username, 'password': password, 'port': port}))}
  );
}

export function GetRibData(ip, username, password, port) {
    return new Promise(resolve => {
        resolve(axios.post('/index', {'ip': ip, 'username': username, 'password': password, 'port': port}));
    });
  }



  
  
  
