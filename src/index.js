import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot, atom } from 'recoil';


export const encytpKey = atom({
  key: 'key',
  default: 'jdh%):Aap(3>S#', 
});

ReactDOM.render(
      <RecoilRoot>
        <App />
      </RecoilRoot>,
   document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
