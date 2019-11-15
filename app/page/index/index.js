import React from 'react';
import Header from '../../components/header/header.js';
import SiderBarLayout from '../../components/sider-bar/index.js';
import ContentLayout from '../../components/content-layout/index.js';
import RightPanelLayout from '../../components/right-panel-layout/index.js';
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