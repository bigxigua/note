import React from 'react';
import Icon from '@common/icon';
// import { checkBrowser } from '@util/util';
import './index.css';

const typeClassName = {
  default: 'button-default',
  primary: 'button-primary',
  dashed: 'Button_dash',
  danger: 'button-danger'
};

/**
  * Button按钮
  * @param {ReactNode} icon - 按钮icon
  * @param {ReactNode} children - 内容
  * @param {boolean} particle - 是否显示点击粒子动画，默认true
  * @param {boolean} loading - 是否显示加载态，默认false
  * @param {boolean} disabled -  是否显示禁用态，默认false
  * @param {string} type -  按钮类型，参考typeClassName
  * @param {string} className -  className
  * @param {object} style -  按钮style
  * @param {string|ReactNode} content - 按钮内容
  * @param {object|null}} link - 如果按钮行为为链接，需要传to, target
  * @param {Function} onClick - 点击回调
*/
export default function Button(props) {
  const {
    icon, // 按钮图标
    children,
    particle = true,
    loading = false, // 是否显示loading
    disabled = false, // 是否禁用
    type = 'default', // 类型
    className = '',
    style = {},
    content = '',
    link = null,
    onClick = () => { }
  } = props;
  // const { isMobile } = checkBrowser();
  const loadingClassName = loading ? 'button-loading' : '';
  const disabledClassName = disabled ? 'button-disabled' : '';
  // const mobileClassName = isMobile ? 'button-mobile' : '';

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

  const classes = $.trim(`button ${particle ? 'button_particle' : ''} ${className} ${typeClassName[type]} ${loadingClassName} ${disabledClassName}`);

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