import React, { useState } from 'react';
import Header from '@components/header/header';
import NewChooseType from './components/choose-type';
import Preview from './components/preview';
import './index.css';

export default function New() {
  const [space, setSpace] = useState({
    scene: 'DOCS'
  });
  return (
    <div className="container">
      <Header />
      <div className="New_Wrapper">
        <div className="New_Header">
          <h1>新建知识库</h1>
          <p>对你的知识进行分类，这里可不是垃圾哟，分好类、事半功倍!</p>
        </div>
        <div className="New_Main">
          <NewChooseType
            space={space}
            setSpace={setSpace} />
          <Preview
            space={space} />
        </div>
      </div>
    </div>
  );
}