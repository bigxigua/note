import React from 'react';
import ArticleHeader from '@components/header-article';
import Editormd from '@components/editormd';
import './index.css';

export default function Editor() {
  return (
    <div className="Container">
      <ArticleHeader />
      <div className="Content_Wrapper">
        <Editormd />
      </div>
    </div>
  );
}