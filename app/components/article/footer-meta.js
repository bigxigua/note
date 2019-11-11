import React, { useContext, useState } from 'react';
import Icon from '../icon/icon.js';
import userContext from '../../context/user/userContext.js';

export default function FooterMeta() {
  const { userInfo } = useContext(userContext);
  const [showPopover, change] = useState(false);
  console.log(showPopover, change);
  console.log('userInfo:', userInfo);
  return (
    <div className="Footer_Meta">
      <div className="Footer_Meta_Item">
        <Icon type="usergroup-delete" />
        <span>陶宝中</span>
      </div>
      <div className="Footer_Meta_Item">
        <Icon type="clock-circle" />
        <span>2019-10-11 12:58</span>
      </div>
      <div className="Footer_Meta_Item">
        <Icon type="read" />
        <span>1000</span>
      </div>
      <div className="Footer_Meta_Item">
        <Icon type="message" />
        <span>10</span>
      </div>
    </div>
  );
};