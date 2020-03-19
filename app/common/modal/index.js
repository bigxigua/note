import React, { useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import Icon from '@common/icon';
import Button from '@common/button';
import { addKeydownListener } from '@util/util';
import confirm from './confirm';
import './index.css';

const toggleDisableBodyScroll = (handle) => {
  document.body.classList[handle]('body-scroll_hiddlen');
};

const loop = () => { };
/**
  * Modal弹框
  * @param {string} wrapClassName - 对话框外层容器的类名
  * @param {boolean} visible - 对话框是否可见
  * @param {boolean} mask - 是否展示遮罩
  * @param {boolean} closable -  是否显示右上角的关闭按钮
  * @param {ReactNode} closeIcon -  自定义关闭图标
  * @param {string|number} width - Modal宽度
  * @param {string} title - 标题
  * @param {string} subTitle - 子标题
  * @param {ReactNode} footer - 底部内容，当不需要默认底部按钮时，可以设为 footer={'none'}
  * @param {string} cancelText - 取消按钮文字
  * @param {ButtonProps} cancelButtonProps - 取消按钮的props
  * @param {string} confirmText - 确认按钮文字
  * @param {ButtonProps} confirmButtonProps - 确认按钮的props
  * @param {Function} onCancel - 点击遮罩层或右上角叉或取消按钮的回调
  * @param {Function} onConfirm -点击确定回调
*/
export default function Modal({
  children = '',
  wrapClassName = '',
  visible = false,
  width = 520,
  onCancel = loop,
  onConfirm = loop,
  title = '',
  subTitle = '',
  mask = true,
  footer = null,
  closeIcon = null,
  closable = true,
  cancelText = '取消',
  cancelButtonProps = {},
  confirmText = '确定',
  confirmButtonProps = {}
}) {
  const w = isNaN(width) ? width : `${width}px`;
  const modalRef = useRef(null);

  // 确认
  const _onConfirm = () => {
    toggleDisableBodyScroll('remove');
    onConfirm();
  };

  // 取消
  const _onCancel = () => {
    toggleDisableBodyScroll('remove');
    onCancel();
    // 移除modal dom元素
    setTimeout(() => {
      // TODO close modal需要remove当前dom
    }, 0);
  };

  const defaultFooter = (
    <div className="modal-footer flex">
      <Button onClick={_onCancel}
        {...cancelButtonProps}>{cancelText}</Button>
      <Button type="primary"
        onClick={_onConfirm}
        {...confirmButtonProps}>{confirmText}</Button>
    </div>
  );
  const footerJsx = footer === 'none' ? null : (footer || defaultFooter);
  const closeJsx = closable && (closeIcon || (
    <Icon type="close"
      onClick={_onCancel}
      className="modal-close" />
  ));

  // 禁止body滑动
  if (visible) {
    toggleDisableBodyScroll('add');
  }

  useEffect(() => {
    const listener = addKeydownListener({
      handle: ({ keyCode }) => {
        if (keyCode === 27) {
          _onCancel();
        }
        if (keyCode === 13) {
          _onConfirm();
        }
      }
    });
    return () => {
      toggleDisableBodyScroll('remove');
      listener.remove();
    };
  }, []);

  let classes = 'modal-mask animated ';
  classes += `${mask ? 'modal-mask__bg' : ''} `;
  classes += `${visible ? 'modal-show' : ''} `;

  return ReactDOM.createPortal(
    (<div
      className={$.trim(classes)}
      ref={modalRef}>
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