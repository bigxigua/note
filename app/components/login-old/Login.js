import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login.jsx';
import './Login.css';

const LOGIN_ELEMENT_ID = 'login_box';

export default class LoginComponent {
  constructor() {
    this.listeners = [];
    this.loginElement = null;
    this.instance = null;
    this.canShowModal = false;
    this.render();
  }

  listen = (key, handle) => {
    const { listeners } = this;
    if (!listeners[key]) {
      listeners[key] = [];
    };
    this.listeners[key].push(handle);
  }

  emit = (key, data = {}) => {
    const { listeners } = this;
    if (listeners[key]) {
      listeners[key].forEach(fn => {
        fn(data);
      });
    }
  }

  hide = () => {
    this.canShowModal = false;
    this.render();
  }

  destroy = () => {
    ReactDOM.unmountComponentAtNode(this.constructor);
    document.body.removeChild(this.loginElement);
  }

  show = () => {
    this.canShowModal = true;
    this.render();
  }

  checkAuthorization = async () => {
    return this.instance.doLogin({}, true);
  }

  quitLoginHandle = async () => {
    return this.instance.quitLogin();
  }

  onLoginStateChange = (info) => {
    this.emit('login:change', info);
  }

  static getInstance = (properties) => {
    if (!this.instance) {
      this.instance = new LoginComponent(properties);
    }
    return this.instance;
  }

  render() {
    let loginElement = document.getElementById(LOGIN_ELEMENT_ID);
    if (!loginElement) {
      loginElement = document.createElement('div');
      loginElement.setAttribute('id', LOGIN_ELEMENT_ID);
      document.body.appendChild(loginElement);
    }
    this.loginElement = loginElement;
    this.instance = ReactDOM.render(<Login
      onLoginStateChange={this.onLoginStateChange}
      hide={this.hide}
      canShowModal={this.canShowModal} />, loginElement);
  }
}