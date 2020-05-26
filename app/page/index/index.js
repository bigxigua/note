import React from 'react';
import Header from '@components/header/header';
import SiderBarLayout from '@components/sider-bar';
import Footer from '@components/footer';
import ContentLayout from '@components/content-layout';
import RightPanelLayout from '@components/right-panel-layout';
import { checkBrowser } from '@util/util';
import './index.css';

export default function Index() {
  const { isMobile } = checkBrowser();
  const classes = $.trim(`content-wrapper_index ${isMobile ? 'content-wrapper__mobile' : ''}`);
  return (
    <div className="container">
      <Header />
      <div className={classes}>
        <SiderBarLayout />
        <ContentLayout />
        <RightPanelLayout />
      </div>
      <Footer />
    </div>
  );
}