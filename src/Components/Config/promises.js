import axios from 'axios';


export function ApiCheck() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.post('/apistatus'));
    }, 5000);
  });
}



 