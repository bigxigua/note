import React from 'react';
import Icon from '@common/icon';
import Button from '@common/button';
import Popover from '@components/popover';
import './index.css';

const loop = () => { };
export default function DropdownButton({
  children = null,
  buttonProps = {},
  onClick = loop,
  overlay = null,
  icon = <Icon type="caret-down" />
}) {
  return (
    <div className="dropdown-button">
      <Button
        content={children}
        {...buttonProps}
        onClick={onClick} />
      <Popover
        content={overlay}
        hideArrow={true}>
        <Button
          className="dropdown-button__dropdown"
          content={icon}
          type={buttonProps.type} />
      </Popover>
    </div>
  );
};