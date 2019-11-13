import React from 'react';
import Icon from '../icon/icon.js';
import { Link } from 'react-router-dom';
import './index.css';

export default function SiderBarLayout() {
  return (
    <div className="SiderBar_Layout">
      <Link to="/"
        className="SiderBar_Link">
        <Icon type="appstore" />
        <span>工作台</span>
      </Link>
      <Link to="/"
        className="SiderBar_Link">
        <Icon type="database" />
        <span>知识库</span>
      </Link>
      <span className="SiderBar_Line"></span>
      <Link to="/"
        className="SiderBar_Link">
        <Icon type="appstore" />
        <span>GitHub Trending</span>
      </Link>
      <Link to="/"
        className="SiderBar_Link">
        <Icon type="database" />
        <span>知乎日榜</span>
      </Link>
      <Link to="/"
        className="SiderBar_Link">
        <Icon type="appstore" />
        <span>掘金日榜</span>
      </Link>
      <Link to="/"
        className="SiderBar_Link">
        <Icon type="database" />
        <span>CSDN日榜</span>
      </Link>
      <Link to="/"
        className="SiderBar_Link">
        <Icon type="database" />
        <span>其他</span>
      </Link>
      <span className="SiderBar_Line"></span>
      <Link to="/"
        className="SiderBar_Link">
        <Icon type="delete" />
        <span>回收站</span>
      </Link>
    </div>
  );
};