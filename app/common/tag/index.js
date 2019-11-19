import React from 'react';
import Icon from '@common/icon';
import './index.css';

export default function Button(props) {
  const {
    className = '',
    children = '',
    w = 'auto',
    h = 'auto',
    closable = false,
    color = 'orange', // 标签背景色
    visible = true, // 是否显示标签
    onClick = console.log
  } = props;
  return (
    <div
      style={{ width: w, height: h, backgroundColor: color, display: visible }}
      className={`Tag flex ${className}`}
      onClick={onClick}>
      {children}
      {closable && <Icon type="close" />}
    </div>
  );
};