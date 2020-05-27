import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { checkBrowser } from '@util/util';
import './index.css';

export default function SiderBarLayout() {
  const { isMobile } = checkBrowser();
  if (isMobile) return null;
  return (
    <div className="siderbar-layout">
      <NavLink
        to="/"
        exact
        activeStyle={{ color: '#000', fontWeight: 'bold' }}
        className="siderbar-link">
        <img src="/images/workspace.png" />
        <span>工作台</span>
      </NavLink>
      <NavLink to="/space/"
        exact
        activeStyle={{ color: '#000', fontWeight: 'bold' }}
        className="siderbar-link">
        <img src="/images/warehouse.png" />
        <span>知识库</span>
      </NavLink>
      <NavLink to="/docs/"
        activeStyle={{ color: '#000', fontWeight: 'bold' }}
        className="siderbar-link">
        <img src="/images/documentation.png" />
        <span>文档</span>
      </NavLink>
      <span className="SiderBar_Line"></span>
      {/* <Link to="/"
        className="siderbar-link">
        <img src="/images/github.png" />
        <span>GitHub Trending</span>
      </Link>
      <Link to="/"
        className="siderbar-link">
        <img src="/images/zhihu.png" />
        <span>知乎日榜</span>
      </Link>
      <Link to="/"
        className="siderbar-link">
        <img src="/images/juejin.png" />
        <span>掘金日榜</span>
      </Link>
      <Link to="/"
        className="siderbar-link">
        <img src="/images/csdn.png" />
        <span>CSDN日榜</span>
      </Link> */}
      {/* <Link to="/"
        className="siderbar-link">
        <img src="/images/more.png" />
        <span>其他</span>
      </Link> */}
    </div>
  );
};