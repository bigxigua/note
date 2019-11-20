import React, { useContext } from 'react';
import Icon from '@common/icon';
import userContext from '@context/user/userContext';
import { formatTimeStamp } from '@util/util';

export default function FooterMeta({
  docInfo: { updated_at_timestamp }
}) {
  const { userInfo } = useContext(userContext);
  return (
    <div className="Footer_Meta">
      <div className="Footer_Meta_Item">
        <Icon type="usergroup-delete" />
        <span>{userInfo.account || userInfo.nickname}</span>
      </div>
      <div className="Footer_Meta_Item">
        <Icon type="clock-circle" />
        <span>{formatTimeStamp(updated_at_timestamp)}</span>
      </div>
      <div className="Footer_Meta_Item">
        <Icon type="read" />
        <span>0</span>
      </div>
      <div className="Footer_Meta_Item">
        <Icon type="message" />
        <span>0</span>
      </div>
    </div>
  );
};