import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Icon, Input, Tooltip, Modal, Button, message } from 'antd';
import axiosInstance from '../../util/axiosInstance.js';
import './Login.css';

const LOGIN_ELEMENT_ID = 'login_box';
const LOGIN_ELEMENT_HIDE_CLASS = 'login_box_hide';
export default class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            account: '',
            password: '',
            userInfo: {},
            loading: false
        };
    }
    componentDidMount() {
        this.setState({
            showModal: true
        });
        const sessionId = window.localStorage.getItem('sessionId');
        sessionId && this.doLogin(sessionId);
    }
    doLogin = ({}, sessionId = '') => {
        const { account, password } = this.state;
        this.setState({ loading: true });
        axiosInstance.post('login', {
            account,
            password,
            sessionId
        }).then((response) => {
            this.setState({ loading: false });
            const {
                isError,
                message: _message_,
                userInfo,
                token
            } = response.data;
            if (!isError && userInfo && token) {
                console.log(token);
                LoginComponent.emit('login:change', userInfo);
                window.localStorage.setItem('sessionId', token);
                this.setState({ showModal: false });
            } else {
                LoginComponent.emit('login:change', null);
                message.error(_message_);
            }
        }).catch(error => {
            message.error('系统繁忙');
            LoginComponent.emit('login:change', null);
            this.setState({ loading: false });
        });
    }
    onInputHandle = (e) => {
        const {
            type,
            value
        } = e.currentTarget;
        if (type === 'text') {
            this.setState({ account: value });
        } else {
            this.setState({ password: value });
        }
    }
    static listen = (key, handle) => {
        let { listeners } = this;
        if (!listeners[key]) {
            listeners[key] = [];
        };
        listeners[key].push(handle);
    }
    static emit = (key, data = {}) => {
        let { listeners } = this;
        if (listeners[key]) {
            listeners[key].forEach(fn => {
                fn(data);
            });
        }
    }
    render() {
        const { account, password, loading } = this.state;
        return (
            <div className="login_container">
                <Modal
                    title="土川记"
                    centered={true}
                    confirmLoading={true}
                    destroyOnClose={true}
                    visible={this.state.showModal}
                    footer={[
                        <Button
                            key="submit"
                            type="primary"
                            onClick={this.doLogin}
                            className="login_submit_btn"
                            loading={loading}
                            disabled={!password || !account}>
                            登录
                        </Button>
                    ]}
                >
                    <Input
                        placeholder="请输入账号"
                        className="login_input"
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        onChange={this.onInputHandle}
                        value={account}
                        type="accont"
                        suffix={
                            <Tooltip title="邮箱/手机号/昵称均可">
                                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />
                    <Input.Password placeholder="输入密码" className="login_input" onChange={this.onInputHandle} value={password} />
                </Modal>
            </div>
        )
    }
}
LoginComponent.createInstance = function createLoginInstance(properties) {
    let loginElement = document.getElementById(LOGIN_ELEMENT_ID);
    if (!loginElement) {
        loginElement = document.createElement('div');
        loginElement.setAttribute('id', LOGIN_ELEMENT_ID);
        document.body.appendChild(loginElement);
        ReactDOM.render(React.createElement(LoginComponent, properties || {}), loginElement);
    } else {
        loginElement.classList.remove(LOGIN_ELEMENT_HIDE_CLASS);
    }
    return {
        destroy() {
            ReactDOM.unmountComponentAtNode(loginElement);
            document.body.removeChild(loginElement);
        },
        hide() {
            loginElement.classList.add(LOGIN_ELEMENT_HIDE_CLASS);
        }
    };
}
LoginComponent.listeners = {};