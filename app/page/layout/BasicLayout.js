import React from 'react';
import Header from '@components/header/header.js';
import SiderBarLayout from '@components/sider-bar';
import RightPanelLayout from '@components/right-panel-layout';
import './index.less';

export default function Index({ children }) {
  return (
    <div className="Container">
      <Header />
      <div className="Content_Wrapper_Index">
        <SiderBarLayout />
        <div className="Content_Layout">
          {children}
        </div>
        {/* 右侧边栏 */}
        <RightPanelLayout />
      </div>
    </div>
  );
}