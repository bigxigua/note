import React, { useContext } from 'react';
import Icon from '@common/icon';
import userContext from '../../context/user/userContext.js';
import './index.css';

export default function HeaderUserPopover() {
  const { userInfo: { avatar, nickname, intro } } = useContext(userContext);
  return (
    <div className="header-user-popover animated">
      <div className="header-userpopover-top">
        <img src={avatar}
          alt="头像"
          className="header-userpopover-avatar" />
        <div className="header-userpopover-info">
          <div>昵称: <span>{nickname}</span></div>
          <div>介绍: <span>{intro}</span></div>
        </div>
      </div>
      <div className="header-userpopover-bom">
        <div className="header-userpopover-link">
          <Icon type="setting" />
          <span>收藏夹</span>
          <Icon type="right" />
        </div>
        <div className="header-userpopover-link">
          <Icon type="setting" />
          <span>设置</span>
          <Icon type="right" />
        </div>
        <div className="header-userpopover-link">
          <Icon type="setting" />
          <span>退出</span>
          <Icon type="right" />
        </div>
      </div>
    </div>
  );
};