import React from 'react';
import Icon from '@common/icon';
import { checkBrowser } from '@util/util';
import './index.css';

const typeClassName = {
  default: 'button-default',
  primary: 'button-primary',
  dashed: 'Button_dash',
  danger: 'button-danger'
};

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
    onClick = () => { },
    style = {}
  } = props;

  const { isMobile } = checkBrowser();
  const loadingClassName = loading ? 'button-loading' : '';
  const disabledClassName = disabled ? 'button-disabled' : '';
  const mobileClassName = isMobile ? 'button-mobile' : '';

  const onButtonClick = () => {
    if (loading || disabled) {
      return;
    }
    if (link) {
      const { to, target } = link;
      if (target === 'blank') {
        window.location.href = to;
      } else {
        window.location.href = `/${link.to}`;
      }
    }
    onClick();
  };

  const classes = $.trim(`button button_particle ${className} ${typeClassName[type]} ${loadingClassName} ${disabledClassName} ${mobileClassName}`);

  return (
    <button
      style={style}
      onClick={onButtonClick}
      className={classes}>
      {icon && <Icon type={icon} />}
      {loading && <Icon className="button-loading_Icon"
        type={'loading'} />}
      {
        content || children
      }
    </button>
  );
};