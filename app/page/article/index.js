import React from 'react';
import Header from '../../components/header/header.js';
import Article from '../../components/article/index.js';
import './index.css';

export default function Index() {
  // 隐藏骨架屏
  const skeletonDom = document.querySelector('.skeleton');
  document.body.removeChild(skeletonDom);
  return (
    <div className="Container">
      <Header />
      <div className="Content_Wrapper">
        <Article />
      </div>
    </div>
  );
}