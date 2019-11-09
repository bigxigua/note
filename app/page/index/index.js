import React from 'react';
import Header from '../../components/header/header.js';
import SiderBar from '../../components/sider-bar/index.js';
import './index.css';

export default function Index() {
  // 隐藏骨架屏
  const skeletonDom = document.querySelector('.skeleton');
  document.body.removeChild(skeletonDom);
  return (
    <div className="page_container">
      <Header />
      <div className="Content">
        <SiderBar />
      </div>
    </div>
  );
}