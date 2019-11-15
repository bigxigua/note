import React from 'react';
import Icon from '@common/icon';

export default function FooterMeta() {
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