import React from 'react';
import Header from '@components/header/header';
import NewChooseType from './components/choose-type';
import NewView from './components/view/index';
import './index.css';

export default function New() {
  return (
    <div className="Container">
      <Header />
      <div className="New_Wrapper">
        <div className="New_Header">
          <h1>新建知识库</h1>
          <p>对你的知识进行分类，这里可不是垃圾哟，分好类、事半功倍!</p>
        </div>
        <div className="New_Main">
          <NewChooseType />
          <NewView />
        </div>
      </div>
    </div>
  );
}