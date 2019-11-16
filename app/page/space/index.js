import React from 'react';
import Header from '../../components/header/header.js';
import SiderBarLayout from '../../components/sider-bar/index.js';
import ContentLayout from '../../components/content-layout/index.js';
import './index.css';

export default function Space() {
  return (
    <div className="Container">
      <Header />
      <div className="Content_Wrapper_Index">
        <SiderBarLayout />
        <ContentLayout />
      </div>
    </div>
  );
}