import React from 'react';
import Header from '@components/header/header.js';
import SiderBarLayout from '@components/sider-bar';
import ContentLayout from '@components/content-layout';
import RightPanelLayout from '@components/right-panel-layout';
import './index.css';

export default function Index() {
  return (
    <div className="Container">
      <Header />
      <div className="Content_Wrapper_Index">
        <SiderBarLayout />
        <ContentLayout />
        {/* 右侧边栏 */}
        <RightPanelLayout />
      </div>
    </div>
  );
}