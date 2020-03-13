import React from 'react';
import RecentContentLayout from './recent-content-layout';
import ShortcutEntrance from '@components/shortcut-entrance';
import MobileNav from '@components/mobile-nav';
import CreateDocButtton from '@components/create-doc-button';
import './index.css';

export default function ContentLayout() {
  return (
    <div className="content-layout">
      <ShortcutEntrance />
      <div className="content-layout__head">
        <div className="content-recent-edit">最近编辑</div>
        <MobileNav />
        <CreateDocButtton />
      </div>
      <RecentContentLayout />
    </div>
  );
};