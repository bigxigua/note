import React, { useEffect, useState, useContext, useCallback } from 'react';
import axiosInstance from '../../util/axiosInstance';
import userContext from '../../context/user/userContext.js';
import { Redirect, useLocation, matchPath } from 'react-router-dom';
import { getIn } from '../../util/util';

const checkAuthorization = async () => {
  const [, data] = await axiosInstance.post('login');
  const isLogin = getIn(data, ['uuid'], false);
  return { isLogin, isHasAuth: true, data };
};

export default function VerifiRoute(props) {
  const [state, setState] = useState(null);
  const { component: Component } = props;
  const { pathname } = useLocation();
  const { userInfo, updateUserInfo } = useContext(userContext);

  console.log(pathname);

  const init = useCallback(async () => {
    const match = matchPath(pathname, props.pathname);
    document.title = props.title;
    window.scrollTo(0, 0);
    if (match && !userInfo.uuid) {
      const { isLogin, isHasAuth, data } = await checkAuthorization();
      setState({
        isLogin,
        isHasAuth,
        currentLocation: encodeURIComponent(window.location.href)
      });
      // 更新用户信息到context
      updateUserInfo(data);
    }
    // TODO 文章访问权限控制
    if (userInfo.uuid) {
      setState({ isLogin: true, isHasAuth: true });
    }
  }, []);

  useEffect(() => {
    init();
  }, []);

  if (!state) return null;

  // 分享页面无需重定向登陆
  if (!state.isLogin && !/\/share\//.test(pathname)) {
    return <Redirect to={{
      pathname: '/login',
      search: `?returnUrl=${state.currentLocation}`
    }} />;
  }

  if (!state.isHasAuth) {
    return <Redirect to={{
      pathname: '/login',
      search: `?returnUrl=${state.currentLocation}`
    }} />;
  }

  return <Component />;
}