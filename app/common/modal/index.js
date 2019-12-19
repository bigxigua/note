import React from 'react';
import ReactDOM from 'react-dom';
import Icon from '@common/icon';
import Button from '@common/button';
import './index.css';

const fn = () => { };
export default function Modal({
  children = '',
  wrapClassName = '', // 对话框外层容器的类名
  visible = false, // 对话框是否可见
  width = 520, // 宽度
  onCancel = fn, // 点击遮罩层或右上角叉或取消按钮的回调
  onConfirm = fn, // 点击确定回调
  title = '', // 标题
  subTitle = '', // 子标题
  mask = true, //  是否展示遮罩
  footer = null, // 底部内容，当不需要默认底部按钮时，可以设为 footer={'none'}
  closeIcon = null, // 自定义关闭图标
  closable = true, // 是否显示右上角的关闭按钮
  cancelText = '取消', // 取消按钮文字
  confirmText = '确定' // 确认按钮文字
}) {
  const w = isNaN(width) ? width : `${width}px`;
  const visibleClass = visible ? 'Modal_Show' : '';
  const defaultFooter = (
    <div className="Modal_Footer flex">
      <Button onClick={onCancel}>{cancelText}</Button>
      <Button type="primary"
        onClick={onConfirm}>{confirmText}</Button>
    </div>
  );
  const footerJsx = footer === 'none' ? null : (footer || defaultFooter);
  const closeJsx = closable && (closeIcon || (
    <Icon type="close"
      onClick={onCancel}
      className="Modal_Close" />
  ));
  const hasMaskClass = mask ? 'Modal_Mask_Bg' : '';
  return ReactDOM.createPortal(
    (<div className={`Modal_Mask animated ${hasMaskClass} ${visibleClass}`}>
      <div className={`Modal ${wrapClassName}`}
        style={{
          width: w
        }}>
        <div className="Modal_Header">
          <span>{title}</span>
          <p>{subTitle}</p>
        </div>
        {closeJsx}
        <div className="Modal_Body">
          {children}
        </div>
        {footerJsx}
      </div>
    </div>)
    , document.body);
};