import React from 'react';
import ArticleHeader from '../../components/header-article/index.js';
import Editormd from '../../components/editormd/index.js';
import './index.css';

export default function Editor() {
  // 隐藏骨架屏
  // const skeletonDom = document.querySelector('.skeleton');
  // document.body.removeChild(skeletonDom);
  return (
    <div className="Container">
      <ArticleHeader />
      <div className="Content_Wrapper">
        <Editormd />
      </div>
    </div>
  );
}