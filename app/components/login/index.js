import React, { useState } from 'react';
import Input from '../input/index.js';
import Icon from '../icon/icon.js';
import { Link } from 'react-router-dom';
import axiosInstance from '../../util/axiosInstance';
import { getIn, parseUrlQuery } from '../../util/util.js';
import './index.css';

export default function Login() {
  // TODO 如果从注册切到登陆时returnUrl的问题
  const isLoginPage = window.location.pathname === '/login';
  const { returnUrl = '' } = parseUrlQuery();
  const [state, setState] = useState({ account: '', password: '' });
  const [errorInfo, setErrorInfo] = useState({
    accountErrorMsg: '',
    passwordErrorMsg: ''
  });
  // 1. 空值提示
  // 2. 格式不对提示
  // 3. 取服务端返回的错误-服务端需要区分帐号/密码
  const onChange = (type, e) => {
    setState({
      ...state,
      [`${type}`]: e.currentTarget.value
    });
  };
  // 验证用户输入
  const onVerifyInput = ({ account, password }) => {
    const errorInfo = {};
    if (!account || account.length < 5) {
      errorInfo.accountErrorMsg = '请输入正确帐号格式，至少 5 位';
    }
    if (!password || password.length < 6) {
      errorInfo.passwordErrorMsg = '请输入正确密码格式，至少 6 位';
    }
    setErrorInfo(errorInfo);
    return errorInfo.passwordErrorMsg || errorInfo.accountErrorMsg;
  };
  // 提交表单
  const onSubmit = async () => {
    const path = isLoginPage ? 'login' : 'register';
    const verifyNotPass = onVerifyInput(state);
    if (verifyNotPass) {
      return;
    }
    const [error, data] = await axiosInstance.post(path, state);
    if (!error && getIn(data, ['uuid'])) {
      // TODO 保存用户信息到context
      // TODO 回跳修改为replace
      const herf = isLoginPage ? decodeURIComponent(returnUrl) : '/';
      window.location.href = herf;
    } else {
      handleError(error);
    }
  };
  const handleError = (error) => {
    const code = getIn(error, ['code']);
    const message = getIn(error, ['message'], '系统开小差了，请稍后再试');
    const errorInfo = {};
    console.log(`[${isLoginPage ? '登陆' : '注册'}失败] `, error);
    if (code === 20003) {
      // 帐号不存在
      errorInfo.accountErrorMsg = message;
    } else if (code === 20004) {
      // 密码错误
      errorInfo.passwordErrorMsg = message;
    } else {
      // TODO 其他错误的展示形式
    }
    setErrorInfo(errorInfo);
  };
  return (
    <div className="Login_Wrapper">
      <img
        src="https://pic4.zhimg.com/v2-a026c6cf35d9c35765d6af1f9101b74e.jpeg"
        alt=""
        className="Login_logo"/>
      <h1 className="Login_title">一日一记</h1>
      <h2 className="Login_sub_title">工欲善其事，必先利其器</h2>
      <Input
        onChange={(e) => { onChange('account', e); }}
        addonBefore={<Icon type="user" />} />
      {errorInfo.accountErrorMsg && (
        <span className="Login_Error">{errorInfo.accountErrorMsg}</span>
      )}
      <Input
        addonBefore={<Icon type="lock" />}
        onChange={(e) => { onChange('password', e); }}
        type="password" />
      {errorInfo.passwordErrorMsg && (
        <span className="Login_Error">{errorInfo.passwordErrorMsg}</span>
      )}
      <button
        className="Login_submit flex"
        onClick={onSubmit}>
        {isLoginPage ? '立即登陆' : '立即注册'}
      </button>
      <Link
        className="Login_action"
        to={isLoginPage ? '/register' : '/login'}>
        {isLoginPage ? '立即注册' : '立即登陆'}
      </Link>
      <span className="Login_Tips">
        一定要记住你的帐号哟，忘记了可是没办法找回来的。
      </span>
    </div>
  );
};