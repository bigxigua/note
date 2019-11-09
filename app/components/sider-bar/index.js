import React, { useContext, useState } from 'react';
import Icon from '../icon/icon.js';
import { Link } from 'react-router-dom';
import userContext from '../../context/user/userContext.js';
import './index.css';

export default function SiderBar() {
  const { userInfo } = useContext(userContext);
  const [showPopover, change] = useState(false);
  console.log(showPopover, change);
  console.log('userInfo:', userInfo);
  return (
    <div className="SiderBar">
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
    </div>
  );
};