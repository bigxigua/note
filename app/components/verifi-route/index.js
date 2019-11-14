import React, { useEffect, useState } from 'react';
import axiosInstance from '../../util/axiosInstance';
import { Redirect, Route, useLocation, matchPath } from 'react-router-dom';
import { getIn } from '../../util/util';

export default function VerifiRoute(props) {
  const [userInfo, setUserInfo] = useState(null);
  const { component: Component, path, exact, strict } = props;
  const { pathname } = useLocation();
  const checkAuthorization = async () => {
    const [, data] = await axiosInstance.post('login');
    const isLogin = getIn(data, ['uuid'], false);
    return { isLogin, isHasAuth: true, userInfo: data };
  };
  useEffect(() => {
    const asyncFn = async () => {
      const match = matchPath(pathname, props);
      if (match) {
        const { isLogin, isHasAuth, userInfo } = await checkAuthorization();
        setUserInfo({
          isLogin,
          isHasAuth,
          userInfo,
          currentLocation: encodeURIComponent(window.location.href)
        });
      }
    };
    asyncFn();
  }, []);
  if (!userInfo) return null;
  if (!userInfo.isLogin) {
    return <Redirect to={{
      pathname: '/login',
      search: `?returnUrl=${userInfo.currentLocation}`
    }} />;
  }
  if (!userInfo.isHasAuth) {
    return <Redirect to={{
      pathname: '/login',
      search: `?returnUrl=${userInfo.currentLocation}`
    }} />;
  }
  return (
    <Route
      exact={exact}
      path={path}
      strict={strict}
      component={Component}
    />
  );
}