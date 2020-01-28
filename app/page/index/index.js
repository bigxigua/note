import React from 'react';
import Header from '@components/header/header';
import SiderBarLayout from '@components/sider-bar';
import Footer from '@components/footer';
import ContentLayout from '@components/content-layout';
import RightPanelLayout from '@components/right-panel-layout';
import './index.css';

export default function Index() {
  return (
    <div className="Container">
      <Header />
      <div className="content-wrapper_index">
        <SiderBarLayout />
        <ContentLayout />
        <RightPanelLayout />
      </div>
      <Footer />
    </div>
  );
}