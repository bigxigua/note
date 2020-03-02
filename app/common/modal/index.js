import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Icon from '@common/icon';
import Button from '@common/button';
import confirm from './confirm';
import './index.css';

const toggleDisableBodyScroll = (handle) => {
  document.body.classList[handle]('body-scroll_hiddlen');
};

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

  const _onConfirm = () => {
    toggleDisableBodyScroll('remove');
    onConfirm();
  };

  const _onCancel = () => {
    toggleDisableBodyScroll('remove');
    onCancel();
  };

  const defaultFooter = (
    <div className="modal-footer flex">
      <Button onClick={_onCancel}>{cancelText}</Button>
      <Button type="primary"
        onClick={_onConfirm}>{confirmText}</Button>
    </div>
  );
  const footerJsx = footer === 'none' ? null : (footer || defaultFooter);
  const closeJsx = closable && (closeIcon || (
    <Icon type="close"
      onClick={_onCancel}
      className="modal-close" />
  ));
  let classes = 'modal-mask animated ';
  classes += `${mask ? 'modal-mask__bg' : ''} `;
  classes += `${visible ? 'modal-show' : ''} `;

  if (visible) {
    toggleDisableBodyScroll('add');
  }

  useEffect(() => {
    return () => {
      toggleDisableBodyScroll('remove');
    };
  }, []);

  return ReactDOM.createPortal(
    (<div className={$.trim(classes)}>
      <div className={$.trim(`modal ${wrapClassName}`)}
        style={{
          width: w
        }}>
        <div className="modal-header">
          <span>{title}</span>
          <p>{subTitle}</p>
        </div>
        {closeJsx}
        <div className="modal-body">
          {children}
        </div>
        {footerJsx}
      </div>
    </div>)
    , document.body);
};

Modal.confirm = confirm;