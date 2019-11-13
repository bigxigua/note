import React, { useContext } from 'react';
import Icon from '../icon/icon.js';
import HeaderUserPopover from '../header-user-popover/index.js';
import userContext from '../../context/user/userContext.js';
import './avatar.css';

export default function Avatar() {
  const { userInfo } = useContext(userContext);
  return (
    <div className="Avatar_wrapper">
      <img src={userInfo.avatar}
        className="Avatar"
        alt="" />
      <Icon type="caret-down" />
      <HeaderUserPopover />
    </div>
  );
};