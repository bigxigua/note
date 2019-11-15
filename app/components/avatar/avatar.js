import React, { useContext, Fragment } from 'react';
import Icon from '@common/icon';
import userContext from '../../context/user/userContext.js';
import Popover from '../popover/index.js';
import './avatar.css';

function Content(props) {
  const { userInfo: { avatar, nickname, account, headline } } = props;
  return (
    <div className="header-user-popover animated">
      <div className="header-userpopover-top">
        <img src={avatar}
          alt="头像"
          className="header-userpopover-avatar"/>
        <div className="header-userpopover-info">
          <div>昵称: <span>{account || nickname}</span></div>
          <div>介绍: <span>{headline || '空空如也'}</span></div>
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
}
export default function Avatar() {
  const { userInfo } = useContext(userContext);
  if (!userInfo || !userInfo.uuid) {
    return null;
  }
  return (
    <Fragment>
      <Popover
        className="Avatar_wrapper"
        content={<Content userInfo={userInfo} />}>
        <img src={userInfo.avatar}
          className="Avatar"
          alt="" />
        <Icon type="caret-down"
          className="Avatar_Down_Icon" />
      </Popover>
    </Fragment>
  );
};