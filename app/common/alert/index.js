import React, { useCallback, useRef, useEffect } from 'react';
import Icon from '@common/icon';
import './index.css';

/**
  * Button按钮
  * @param {string} className - className
  * @param {string|ReactNode} message - 文案
  * @param {string|ReactNode} description - 警告提示的辅助性文字介绍
  * @param {string} type - 指定警告提示的样式，有四种选择 success、info、warning、error
  * @param {ReactNode} icon - 自定义图标，showIcon 为 true 时有效
  * @param {boolean} showIcon - 是否显示辅助图标
  * @param {boolean} closable - 默认不显示关闭按钮
  * @param {(e: MouseEvent) => void} onClose - 关闭时触发的回调函数
*/
export default function Alert({
  className = '',
  message = '',
  description = '',
  type = 'info',
  icon = null,
  showIcon = false,
  closable = false,
  onClose = () => { }
}) {
  const alertRef = useRef(null);
  let classes = `animated alert alert-${type}`;
  classes += description ? ' alert-with__description' : '';

  const onCloseHandle = useCallback(() => {
    onClose();
    alertRef.current.classList.add('fadeOutUp');
  }, []);

  useEffect(() => {
    $(alertRef.current).on('animationend webkitAnimationEnd', () => {
      $(alertRef.current).remove();
    });
    return () => {
      alertRef.current.off('animationend webkitAnimationEnd');
    };
  }, []);

  return (
    <div className={$.trim(`${classes} ${className}`)}
      ref={alertRef}>
      {showIcon && (icon || <Icon className="alert-icon"
        type={type} />)}
      {closable && <Icon type="close"
        onClick={onCloseHandle}
        className="alert-close" />}
      <span className="alert-message">{message}</span>
      <span className="alert-description">{description}</span>
    </div>
  );
};