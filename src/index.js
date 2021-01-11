import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from "redux";
import reducer from "./store/reducer";
import "./fonts/IRANSansWeb.ttf";
import "./fonts/IRANSansWeb_Bold.ttf";
import "./fonts/IRANSansWeb_Light.ttf";
import "./fonts/IRANSansWeb_Medium.ttf";
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import 'font-awesome/css/font-awesome.min.css';
const store = createStore(reducer)


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App  />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

