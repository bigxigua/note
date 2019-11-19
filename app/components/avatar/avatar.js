import React, { useContext, Fragment } from 'react';
import Icon from '@common/icon';
import userContext from '@context/user/userContext';
import Popover from '@components/popover';
import axiosInstance from '@util/axiosInstance';
import './avatar.css';

function Content(props) {
  const { userInfo: { avatar, nickname, account, headline } } = props;
  const onOutLogin = async () => {
    const [error, data] = await axiosInstance.post('login/out');
    if (data && data.STATUS === 'OK') {
      window.location.reload();
      return;
    }
    console.log('[退出登陆失败] ', error);
  };
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
        <div className="header-userpopover-link"
          onClick={onOutLogin}>
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