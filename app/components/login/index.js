import React, { useState, useContext, useEffect, useCallback } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import Input from '@common/input';
import Icon from '@common/icon';
import Button from '@common/button';
import axiosInstance from '@util/axiosInstance';
import { getIn, parseUrlQuery, addKeydownListener } from '@util/util';
import userContext from '@context/user/userContext';
import useMessage from '@hooks/use-message';
import './index.css';

const copywriting = {
  login: {
    title: '西瓜笔记',
    subTitle: '工欲善其事，必先利其器'
  },
  register: {
    title: '注册',
    subTitle: '若人间有情，那是开始，也是尽头'
  }
};

const message = useMessage();

function handleError(error, setErrorInfo) {
  const code = getIn(error, ['code']);
  const content = getIn(error, ['message'], '系统开小差了，请稍后再试');
  const errorInfo = {};
  if (code === 20003) {
    // 帐号不存在
    errorInfo.accountErrorMsg = content;
  } else if (code === 20004) {
    // 密码错误
    errorInfo.passwordErrorMsg = content;
  } else {
    message.error({ content });
  }
  setErrorInfo(errorInfo);
}

export default function Login() {
  // TODO 如果从注册切到登陆时returnUrl的问题
  const isLoginPage = window.location.pathname === '/login';
  const { returnUrl = '' } = parseUrlQuery();
  const [state, setState] = useState({ account: '大西瓜的笔记', password: '18856152575' });
  const [logo, setLogo] = useState('/images/pikachu_front.svg');
  const [errorInfo, setErrorInfo] = useState({
    accountErrorMsg: '',
    passwordErrorMsg: ''
  });
  const [loading, setLoading] = useState(false);
  const { updateUserInfo } = useContext(userContext);
  const history = useHistory();

  useEffect(() => {
    const listener = addKeydownListener({
      handle: ({ keyCode }) => {
        keyCode === 13 && onSubmit();
      }
    });
    setErrorInfo({});
    return () => {
      listener.remove();
    };
  }, [state, isLoginPage]);

  const onChange = useCallback((type, e) => {
    setState({
      ...state,
      [`${type}`]: e.currentTarget.value
    });
  }, [state.password, state.account]);

  // 验证用户输入
  const onVerifyInput = useCallback(({ account, password }) => {
    const errorInfo = {};
    // return '1111';
    if (!account || account.length < 5) {
      errorInfo.accountErrorMsg = '请输入正确帐号格式，至少 5 位';
    }
    if (!password || password.length < 6) {
      errorInfo.passwordErrorMsg = '请输入正确密码格式，至少 6 位';
    }
    setErrorInfo(errorInfo);
    return errorInfo.passwordErrorMsg || errorInfo.accountErrorMsg;
  }, []);

  // 提交表单
  const onSubmit = async () => {
    const path = isLoginPage ? 'login' : 'register';
    if (onVerifyInput(state)) return;
    setLoading(true);
    const [error, data] = await axiosInstance.post(path, state);
    setLoading(false);
    if (!error && getIn(data, ['uuid'])) {
      updateUserInfo(data);
      // 登陆页回跳原来页面，注册页回跳首页
      if (isLoginPage && returnUrl) {
        window.location.href = decodeURIComponent(returnUrl);
      } else {
        history.replace('/');
      }
    } else {
      handleError(error, setErrorInfo);
    }
  };

  const text = copywriting[isLoginPage ? 'login' : 'register'];

  return (
    <div className="login_bg">
      <div className="Login_Wrapper">
        <img
          src={logo}
          className="Login_logo" />
        <h1 className="login-title">{text.title}</h1>
        <h2 className="login-subtitle">{text.subTitle}</h2>
        <Input
          style={{ marginBottom: '16px' }}
          defaultValue="大西瓜的笔记"
          onFocus={() => { setLogo('/images/pikachu_front.svg'); }}
          onChange={(e) => { onChange('account', e); }}
          addonBefore={<Icon type="user" />} />
        {errorInfo.accountErrorMsg && (
          <span className="Login_Error">{errorInfo.accountErrorMsg}</span>
        )}
        <Input
          style={{ marginBottom: '16px' }}
          defaultValue="18856152575"
          addonBefore={<Icon type="lock" />}
          onFocus={() => { setLogo('/images/pikachu.svg'); }}
          onChange={(e) => { onChange('password', e); }}
          type="password" />
        {errorInfo.passwordErrorMsg && (
          <span className="Login_Error">{errorInfo.passwordErrorMsg}</span>
        )}
        <Button
          type="primary"
          className="Login_submit"
          loading={loading}
          onClick={onSubmit}>
          {isLoginPage ? '立即登陆' : '立即注册'}
        </Button>
        <NavLink
          className="Login_action"
          to={isLoginPage ? '/register' : '/login'}>
          {isLoginPage ? '立即注册' : '已有账号登陆'}
        </NavLink>
        <span className="Login_Tips">
          努力就完了
        </span>
      </div>
    </div>
  );
};