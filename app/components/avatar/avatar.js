import React, { useContext, Fragment } from 'react';
import Icon from '@common/icon';
import List from '@common/list';
import userContext from '@context/user/userContext';
import Popover from '@components/popover';
import axiosInstance from '@util/axiosInstance';
import useMessage from '@hooks/use-message';
import { delay, getIn } from '@util/util';
import './avatar.css';

const message = useMessage();

const settingList = [{
  text: '退出',
  icon: 'logout',
  key: 'logout'
}, {
  text: '设置',
  icon: 'setting',
  key: 'setting',
  disabled: true
}];

async function onListItemClick(e, info) {
  e.stopPropagation();
  if (info.key === 'logout') {
    const [error, data] = await axiosInstance.post('login/out');
    if (data && data.STATUS === 'OK') {
      message.success({ content: '退出登陆成功' });
      await delay();
      window.location.reload();
    } else {
      message.error({ content: getIn(error, ['message'], '系统繁忙，请稍后再试') });
    }
  }
}

function Content(props) {
  const { userInfo: { avatar, nickname, account } } = props;
  return (
    <div className="header-user-popover animated">
      <div className="header-userpopover-top">
        <img src={avatar}
          alt="头像"
          className="header-userpopover-avatar" />
        <div className="header-userpopover-info">
          <div>{account || nickname}</div>
          <p>行的是流水</p>
        </div>
      </div>
      <List
        onTap={(info, index, event) => { onListItemClick(event, info); }}
        list={settingList}></List>
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
        className="avatar-wrapper"
        content={<Content userInfo={userInfo} />}>
        <img src={userInfo.avatar}
          className="avatar"
          alt="" />
        <Icon type="caret-down"
          className="avatar-down__icon" />
      </Popover>
    </Fragment>
  );
};