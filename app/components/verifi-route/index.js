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
    const isLogin = getIn(data, ['id'], false);
    // TODO 针对每个page设置权限配置文件，根据文件来匹配
    return { isLogin, isHasAuth: true, userInfo: data };
  };
  useEffect(() => {
    const asyncFn = async () => {
      const match = matchPath(pathname, props);
      if (match) {
        const { isLogin, isHasAuth, userInfo } = await checkAuthorization();
        setUserInfo({ isLogin, isHasAuth, userInfo });
        // if (!isLogin) {
        //   console.log('[未登陆，Redirect到/login]');
        // } else {
        //   if (!isHasAuth) {
        //     console.log('[已登陆，无权查看该文档-401]');
        //   }
        // }
      }
    };
    asyncFn();
  }, []);
  if (!userInfo) return null;
  if (!userInfo.isLogin) {
    return <Redirect to="/login" />;
  }
  if (!userInfo.isHasAuth) {
    return <Redirect to="/noAuth" />;
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