import React, { Fragment } from 'react';
import Dropdown from '@common/dropdown';
import Icon from '@common/icon';

function MenuItem({ type, text }) {
  return (
    <div className="New_Permission flex">
      <Icon type={type} />
      <p>{text}</p>
    </div>
  );
};

function Overlay() {
  return (
    <Fragment>
      <MenuItem type="stop"
        text="仅自己可见" />
      <MenuItem type="global"
        text="互联网可见" />
    </Fragment>
  );
}

export default function NewChooseType() {
  return (
    <div className="New_Choose">
      <h1>可见范围</h1>
      <Dropdown overlay={<Overlay />}>
        <MenuItem
          type="stop"
          text="仅自己可见" />
      </Dropdown>
    </div>
  );
};