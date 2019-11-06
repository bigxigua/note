import React, { Component } from 'react';
import { Icon, Input, Tooltip, Modal, Button, message } from 'antd';
import axiosInstance from '../../util/axiosInstance.js';

const LOGIN_ELEMENT_ID = 'login_box';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      password: '',
      loading: false // 登陆按钮的loading icon的显示与否
    };
  }

  componentDidMount() {
  }

    /**
     *  调用登陆/login接口，进行登陆操作
     *  @isAutoLogin {boolean} 是否是自动登陆
     *  @returns {object} null
     */
    doLogin = async (e, isAutoLogin = false) => {
      const { account, password } = this.state || {};
      if (!isAutoLogin) {
        this.setState({ loading: true });
      }
      const [error, response] = await axiosInstance.post('login', { account, password });
      if (!error && response) {
        this.props.onLoginStateChange({
          ...response,
          isAutoLogin
        });
      } else {
        this.props.onLoginStateChange(null);
        !isAutoLogin && message.error(error.message);
      }
      if (!isAutoLogin) {
        this.setState({ loading: false });
        this.onCloseLoginModal();
      }
      return {};
    }

    /**
     *  退出登陆
     *  @returns {object} null
     */
    quitLogin = async () => {
      const [error, data] = await axiosInstance.post('outLogin');
      if (!error && data) {
        this.props.onLoginStateChange(null);
      } else {
        message.error((error || {}).message || '退出登陆失败，请稍后重试');
      }
      return [error, data];
    }

    /**
     *  关闭登陆的madal弹框
     *  @returns {object} null
     */
    onCloseLoginModal = () => {
      this.props.hide();
    }

    /**
     *  获取输入的用户名和密码
     *  @returns {object} null
     */
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

    render() {
      const { account, password, loading } = this.state;
      const { canShowModal } = this.props;
      return (
        <Modal
          title="土川记"
          centered={true}
          confirmLoading={true}
          destroyOnClose={true}
          visible={canShowModal}
          getContainer={() => { return document.getElementById(LOGIN_ELEMENT_ID); }}
          onCancel={this.onCloseLoginModal}
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
            prefix={<Icon type="user"
              style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={this.onInputHandle}
            value={account}
            type="accont"
            suffix={
              <Tooltip title="邮箱/手机号/昵称均可">
                <Icon type="info-circle"
                  style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
          />
          <Input.Password placeholder="输入密码"
            className="login_input"
            onChange={this.onInputHandle}
            value={password} />
        </Modal>
      );
    }
}