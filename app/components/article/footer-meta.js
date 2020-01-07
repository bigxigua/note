import React, { useContext } from 'react';
import Icon from '@common/icon';
import Tooltip from '@common/tooltip';
import userContext from '@context/user/userContext';
import { formatTimeStamp } from '@util/util';
import { fromNow } from '@util/fromNow';

export default function FooterMeta({
  docInfo: { updated_at_timestamp: time }
}) {
  const { userInfo } = useContext(userContext);
  return (
    <div className="Footer_Meta">
      <div className="Footer_Meta_Item">
        <Icon type="usergroup-delete" />
        <span className="ellipsis">{userInfo.account || userInfo.nickname}</span>
      </div>
      <div className="Footer_Meta_Item">
        <Icon type="clock-circle" />
        <Tooltip tips={`更新于${formatTimeStamp(time)}`}>
          <span>{fromNow(time)}</span>
        </Tooltip>
      </div>
    </div>
  );
};