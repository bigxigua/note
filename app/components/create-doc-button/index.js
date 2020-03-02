import React, { useState, useCallback } from 'react';
import DropdownButton from '@components/dropdown-button';
import CreateDoc from '@components/create-doc';
import List from '@common/list';
import './index.css';

const list = [{
  text: '从模版新建文档',
  icon: 'file-add',
  key: 'create-doc-by-template'
}];

/**
* 新建文档通用按钮
* @param {string} spaceId - 空间id，如果存在则表示空间已选定，无需列出空间列表
*/
export default function CreateDocButtton({
  spaceId = ''
}) {
  // 展示/隐藏选择空间Modal
  const [visible, setVisible] = useState(false);
  // 创建文档的方法，common-普通新建 template-从模版创建
  const [mode, setMode] = useState('common');

  const onListItemClick = useCallback((info) => {
    const { key } = info;
    if (key === 'create-doc-by-template') {
      setMode('template');
      setVisible(true);
    }
  }, []);

  return <>
    <DropdownButton
      overlay={
        <List
          list={list}
          onTap={onListItemClick} />
      }
      onClick={() => { setVisible(true); setMode('common'); }}
    >新建文档</DropdownButton>
    {visible &&
      <CreateDoc
        mode={mode}
        onModalChange={setVisible} />}
  </>;
};