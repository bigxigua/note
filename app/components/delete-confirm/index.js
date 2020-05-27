import React, { useState, useCallback } from 'react';
import { Alert } from 'antd';
import Input from '@common/input';
import Button from '@common/button';
import axiosInstance from '@util/axiosInstance';
import useMessage from '@hooks/use-message';
import { getIn } from '@util/util';

import './index.css';

/**
  * 确认删除输入框组件
  * @param {string} name - 需要输入确认的内容
  * @param {string} description - 警告提示文案
  * @param {string} docId - 文档id
  * @param {Function} onConfirmEnd - 删除操作结束，回传删除结果true/false
*/
export default function DeleteConfirm({ name = '', description = '', docId, onConfirmEnd }) {
  const [value, setValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [loading, setLoading] = useState(false);
  const message = useMessage();

  const onChange = useCallback((e) => {
    setValue(e.currentTarget.value);
  }, [name]);

  const onButtonClick = useCallback(async () => {
    setInputError(value !== name);
    if (value === name) {
      setLoading(true);
      const [error, data] = await axiosInstance.post('doc/delete', { docId });
      const errMsg = getIn(error, ['message'], '系统繁忙，请稍后再试');
      const isOk = getIn(data, ['STATUS']) === 'OK';
      setLoading(false);
      if (isOk) {
        message.success({ content: '删除成功' });
      } else {
        message.error({ content: errMsg });
      }
      onConfirmEnd(isOk);
    }
  }, [value, name]);

  return <>
    <Alert message="请慎重!"
      description={description}
      type="warning" />
    <div className="delete-doc__p">
      <span>请输入文档名称: </span>
      <h3>{name}</h3>
    </div>
    <Input
      defaultValue=""
      h={38}
      w={'100%'}
      style={{ marginTop: '10px' }}
      onChange={onChange} />
    {inputError && <span className="delete-doc__error">内容输入错误</span>}
    <Button content="删除"
      loading={loading}
      disabled={loading}
      particle={false}
      className="delete-doc__btn"
      onClick={onButtonClick}
      type="danger" />
  </>;
}