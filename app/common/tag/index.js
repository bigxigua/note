import React from 'react';
import Icon from '@common/icon';
import './index.css';

export default function Button(props) {
  const {
    style = {},
    className = '',
    children = '',
    content = '',
    w = 'auto',
    h = 'auto',
    closable = false,
    color = 'orange', // 标签背景色
    onClick = console.log
  } = props;
  return (
    <div
      style={{ width: w, height: h, backgroundColor: color, ...style }}
      className={`Tag ${className}`}
      onClick={onClick}>
      {content || children}
      {closable && <Icon type="close" />}
    </div>
  );
};