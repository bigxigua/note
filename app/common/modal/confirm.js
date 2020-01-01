import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { isPromise } from '@util/util';
import Modal from './index';

const ConfirmDialog = ({
  className = '',
  cancelText = '取消',
  okText = '确认',
  onCancel = () => { },
  title = '',
  subTitle = '',
  content = '',
  onOk = () => { }
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
    className={className}
    title={title}
    subTitle={subTitle}
    onCancel={() => { setVisible(false); onCancel(); }}
    onConfirm={_onOk_}
    confirmText={okText}
    cancelText={cancelText}
    visible={visible} >
    {content}
  </Modal>;
};

export default function confirm(props) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  ReactDOM.render(<ConfirmDialog {...props} />, div);
  return null;
};