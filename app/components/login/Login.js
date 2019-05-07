import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Icon, Input, Tooltip, Modal, Button, message } from 'antd';
import axiosInstance from '../../util/axiosInstance.js';
import './Login.css';

const LOGIN_ELEMENT_ID = 'login_box';
const LOGIN_ELEMENT_HIDE = 'login_box_hide';
export default class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            account: '',
            password: '',
            loading: false // 登陆按钮的loading icon的显示与否
        };
        this.doLogin = this.doLogin.bind(this);
    }
    componentDidMount() {
        this.setState({
            showModal: true
        });
    }
    async doLogin(e, isAutoLogin = false) {
        const { account, password } = this.state || {};
        if (!isAutoLogin) {
            this.setState({ loading: true });
        }
        try {
            const [error, response] = await axiosInstance.post('login', { account, password });
            if (!error && response) {
                LoginComponent.emit('login:change', response);
                !isAutoLogin && this.setState({ showModal: false });
            } else {
                LoginComponent.emit('login:change', null);
                message.error(error.message);
            }
        } catch (err) {
            message.error('系统繁忙');
            LoginComponent.emit('login:change', null);
        } finally {
            !isAutoLogin && this.setState({ loading: false });
        }
        return {};
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
    static hide = () => {
        this.loginElement.classList.add(LOGIN_ELEMENT_HIDE);
    }
    static checkAuthorization = async () => {
        LoginComponent.prototype.doLogin({}, true);
    }
    static createInstance = (properties) => {
        let loginElement = document.getElementById(LOGIN_ELEMENT_ID);
        this.loginElement = loginElement;
        if (!loginElement) {
            loginElement = document.createElement('div');
            loginElement.setAttribute('id', LOGIN_ELEMENT_ID);
            document.body.appendChild(loginElement);
            ReactDOM.render(React.createElement(LoginComponent, properties || {}), loginElement);
        } else {
            loginElement.classList.remove(LOGIN_ELEMENT_HIDE);
        }
        return {
            destroy() {
                ReactDOM.unmountComponentAtNode(loginElement);
                document.body.removeChild(loginElement);
            },
            hide() {
                loginElement.classList.add(LOGIN_ELEMENT_HIDE);
            }
        };
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
LoginComponent.listeners = {};