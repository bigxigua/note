import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './index.css';

export default function SiderBarLayout() {
  return (
    <div className="SiderBar_Layout">
      <NavLink
        to="/"
        exact
        activeStyle={{ color: '#000', fontWeight: 'bold' }}
        className="SiderBar_Link">
        <img src="/images/workspace.png" />
        <span>工作台</span>
      </NavLink>
      <NavLink to="/space/"
        activeStyle={{ color: '#000', fontWeight: 'bold' }}
        className="SiderBar_Link">
        <img src="/images/warehouse.png" />
        <span>知识库</span>
      </NavLink>
      <NavLink to="/docs/"
        activeStyle={{ color: '#000', fontWeight: 'bold' }}
        className="SiderBar_Link">
        <img src="/images/documentation.png" />
        <span>文档</span>
      </NavLink>
      <span className="SiderBar_Line"></span>
      <Link to="/star"
        className="SiderBar_Link">
        <img src="/images/book.png" />
        <span>关注</span>
      </Link>
      <Link to="/"
        className="SiderBar_Link">
        <img src="/images/github.png" />
        <span>GitHub Trending</span>
      </Link>
      <Link to="/"
        className="SiderBar_Link">
        <img src="/images/zhihu.png" />
        <span>知乎日榜</span>
      </Link>
      <Link to="/"
        className="SiderBar_Link">
        <img src="/images/juejin.png" />
        <span>掘金日榜</span>
      </Link>
      <Link to="/"
        className="SiderBar_Link">
        <img src="/images/csdn.png" />
        <span>CSDN日榜</span>
      </Link>
      <Link to="/"
        className="SiderBar_Link">
        <img src="/images/more.png" />
        <span>其他</span>
      </Link>
      <span className="SiderBar_Line"></span>
      {/* <Link to="/recycle"
        className="SiderBar_Link">
        <img src="/images/recycling.png"
          style={{ width: '17px' }} />
        <span>回收站</span>
      </Link> */}
    </div>
  );
};