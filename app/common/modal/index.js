import React, { Fragment } from 'react';
import './index.css';
import Icon from '@common/icon';
const fn = () => {};
export default function Modal({
  wrapClassName = '', // 对话框外层容器的类名
  visible = false, // 对话框是否可见
  width = 520, // 宽度
  onCancel = fn, // 点击遮罩层或右上角叉或取消按钮的回调
  onConfirm = fn, // 点击确定回调
  title = '', // 标题
  subTitle = '', // 子标题
  mask = true, //  是否展示遮罩
  footer = null, // 底部内容，当不需要默认底部按钮时，可以设为 footer={null}
  closeIcon = <Icon type="close" />, // 自定义关闭图标
  closable = true, // 是否显示右上角的关闭按钮
  cancelText = '取消', // 取消按钮文字
  confirmText = '确定' // 确认按钮文字
}) {
  const w = isNaN(width) ? width : `${width}px`;
  const visibleClass = visible ? 'Modal_Show' : '';
  return (
    <Fragment>
      <div className={`Modal ${wrapClassName} ${visibleClass}`}
        style={{
          width: w
        }}>
        <div className="Modal_Header">
          <span>{title}</span>
          <p>{subTitle}</p>
        </div>
        <Icon type="close"
          className="Modal_Close" />
      </div>
      {mask && <div className="Modal_Mask"></div>}
    </Fragment>
  );
};