import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { isPromise } from '@util/util';
import Modal from './index';

// TODO 支持cancelButtonProps && confirmButtonProps
const ConfirmDialog = ({
  width = undefined,
  mountElement = document.body,
  wrapClassName = '',
  cancelText = '取消',
  top,
  okText = '确认',
  footer = null,
  onCancel = () => { },
  title = '',
  subTitle = '',
  content = '',
  onOk = () => { },
  confirmButtonProps = {},
  cancelButtonProps = {}
}) => {
  const [visible, setVisible] = useState(true);

  const _onOk_ = useCallback(async () => {
    if (isPromise(onOk)) {
      await onOk();
    } else {
      onOk();
    }
    setVisible(false);
  }, []);

  return <Modal
    width={width}
    wrapClassName={wrapClassName}
    title={title}
    subTitle={subTitle}
    top={top}
    mountElement={mountElement}
    footer={footer}
    onCancel={() => { setVisible(false); onCancel(); }}
    onConfirm={_onOk_}
    confirmText={okText}
    cancelText={cancelText}
    confirmButtonProps={confirmButtonProps}
    cancelButtonProps={cancelButtonProps}
    visible={visible} >
    {content}
  </Modal>;
};

export default function confirm(props) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const _props_ = {
    ...props,
    mountElement: div
  };
  ReactDOM.render(<ConfirmDialog {..._props_} />, div);
  return {
    destroy: () => {
      document.body.removeChild(div);
    }
  };
};