import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../util/axiosInstance';
import userContext from '../../context/user/userContext.js';
import { Redirect, useLocation, matchPath } from 'react-router-dom';
import { getIn } from '../../util/util';

export default function VerifiRoute(props) {
  const [state, setState] = useState(null);
  const { component: Component } = props;
  const { pathname } = useLocation();
  const { userInfo, updateUserInfo } = useContext(userContext);
  const checkAuthorization = async () => {
    const [, data] = await axiosInstance.post('login');
    const isLogin = getIn(data, ['uuid'], false);
    return { isLogin, isHasAuth: true, data };
  };
  useEffect(() => {
    const asyncFn = async () => {
      const match = matchPath(pathname, props.pathname);
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
        setState({
          isLogin: true,
          isHasAuth: true
        });
      }
    };
    asyncFn();
  }, []);
  if (!state) return null;
  if (!state.isLogin) {
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