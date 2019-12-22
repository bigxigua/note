import React, { useState } from 'react';
import RecentContentLayout from './recent-content-layout';
import CreateDoc from '@components/create-doc';
import MobileNav from '@components/mobile-nav';
import Button from '@common/button';
import './index.css';

export default function ContentLayout() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="Content_Layout">
      <div className="Content_Layout_Head">
        <div className="content-recent-edit">最近编辑</div>
        <MobileNav />
        <Button onClick={() => { setVisible(true); }}>新建文档</Button>
      </div>
      <RecentContentLayout />
      {visible && <CreateDoc onModalChange={setVisible} />}
    </div>
  );
};