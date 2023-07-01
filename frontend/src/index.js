import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import store from './store';
 

//alert modal;
import {Provider as AlertProvider , transitions, positions} from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

const options={
  timeout:5000,
  positions:positions.BOTTOM_CENTER,
  transitions:transitions.FADE
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...options}>
                <App /> 
        </AlertProvider>
  </Provider>
);

 