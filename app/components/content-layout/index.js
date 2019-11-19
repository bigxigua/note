import React, { useState } from 'react';
import RecentContentLayout from './recent-content-layout';
import Button from '@common/button';
import CreateDoc from '@components/create-doc';
import './index.css';

export default function ContentLayout() {
  const [visible, setVisible] = useState(false);
  function onCreateDoc(stat) {
    setVisible(stat);
  };
  return (
    <div className="Content_Layout">
      <div className="Content_Layout_Head">
        <div className="Content_Layout_Recent_Edit">最近编辑</div>
        <Button onClick={() => { onCreateDoc(true); }}>新建文档</Button>
      </div>
      <RecentContentLayout />
      {visible && <CreateDoc onModalChange={onCreateDoc} />}
    </div>
  );
};