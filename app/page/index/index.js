import React from 'react';
import Header from '../../components/header/header.js';
import SiderBarLayout from '../../components/sider-bar/index.js';
import ContentLayout from '../../components/content-layout/index.js';
import RightPanelLayout from '../../components/right-panel-layout/index.js';
// import useReactRouter from 'use-react-router';
import './index.css';

export default function Index() {
  // 隐藏骨架屏
  // const skeletonDom = document.querySelector('.skeleton');
  // document.body.removeChild(skeletonDom);
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