import React from 'react';
import Icon from '@common/icon';
import './index.css';

export default function Button(props) {
  const {
    icon, // 按钮图标
    children,
    loading = false, // 是否显示loading
    disabled = false, // 是否禁用
    type = 'default', // 类型
    className = '',
    onClick = () => {}
  } = props;
  const typeClassName = {
    default: 'Button_default',
    primary: 'Button_primary',
    dashed: 'Button_dash',
    danger: 'Button_danger'
  };
  const loadingClassName = loading ? 'Button_loading' : '';
  const onButtonClick = () => {
    if (!loading && !disabled) {
      onClick();
    }
  };
  return (
    <button
      onClick={onButtonClick}
      className={`Button flex ${className} ${typeClassName[type]} ${loadingClassName}`}>
      {icon && <Icon type={icon} />}
      {loading && <Icon className="Button_loading_Icon"
        type={'loading'} />}
      {children}
    </button>
  );
};