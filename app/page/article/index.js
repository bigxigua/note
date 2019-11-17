import React from 'react';
import ArticleHeader from '@components/header-article/index';
import Article from '@components/article/index';
import './index.css';

export default function Index() {
  return (
    <div className="Container">
      <ArticleHeader />
      <div className="Content_Wrapper">
        <Article />
      </div>
    </div>
  );
}