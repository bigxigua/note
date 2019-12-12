import React from 'react';
import Icon from '@common/icon';
import { useHistory } from 'react-router-dom';
import './index.css';

export default function Button(props) {
  const {
    icon, // 按钮图标
    children,
    loading = false, // 是否显示loading
    disabled = false, // 是否禁用
    type = 'default', // 类型
    className = '',
    content = '',
    link = null,
    onClick = () => { }
  } = props;
  const typeClassName = {
    default: 'Button_default',
    primary: 'Button_primary',
    dashed: 'Button_dash',
    danger: 'Button_danger'
  };
  const history = useHistory();
  const loadingClassName = loading ? 'Button_loading' : '';
  const disabledClassName = disabled ? 'Button_disabled' : '';
  const onButtonClick = () => {
    if (loading || disabled) {
      return;
    }
    if (link) {
      history.push(link.to);
    }
    onClick();
  };
  return (
    <button
      onClick={onButtonClick}
      className={`Button flex ${className} ${typeClassName[type]} ${loadingClassName} ${disabledClassName}`}>
      {icon && <Icon type={icon} />}
      {loading && <Icon className="Button_loading_Icon"
        type={'loading'} />}
      {
        content || children
      }
    </button>
  );
};