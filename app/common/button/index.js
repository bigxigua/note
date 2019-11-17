import React from 'react';
import Icon from '@common/icon';
import './index.css';

export default function Button(props) {
  const {
    icon,
    children,
    type = 'default',
    className = '',
    onClick = console.log
  } = props;
  const typeClassName = {
    default: 'Button_default',
    primary: 'Button_primary',
    dashed: 'Button_dash',
    danger: 'Button_danger'
  };
  return (
    <button
      onClick={onClick}
      className={`Button ${className} ${typeClassName[type]}`}>
      {icon && <Icon type={icon} />}
      {children}
    </button>
  );
};