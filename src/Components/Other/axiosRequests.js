import axios from 'axios';
import {AES, enc}from 'crypto-js';

const credentials = (decryptKey, customUrl) => {

    const passwordDecrypt = AES.decrypt(localStorage.getItem('password'), decryptKey);

    if(customUrl === undefined){
        
        var credentialsObj = {'ip': localStorage.getItem('ip'), 'username': localStorage.getItem('username'), 
                        'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port')};
    }
    else{
        var credentialsObj = {'ip': localStorage.getItem('ip'), 'username':  localStorage.getItem('username'), 
                        'password': passwordDecrypt.toString(enc.Utf8), 'port': localStorage.getItem('port'), 'url': customUrl};
    }

    return credentialsObj

}

export const ApiRequest = async (decryptKey, url, customUrl) => {  

    const payload = credentials(decryptKey, customUrl)
    const response = await axios.post(url, payload).then(response => {
        
    return response

    }).catch(error => {
        console.log(error)
    })

    return response
}



