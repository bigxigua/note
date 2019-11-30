import React from 'react';
import Header from '@components/header/header';
import SiderBarLayout from '@components/sider-bar/index';
import Footer from '@components/footer';
import './index.css';

export default function PageLayout({
  style = {},
  className = '',
  content = null
}) {
  return (
    <div
      className={`Container ${className}`}
      style={style}>
      <Header />
      <div className="Content_Wrapper_Index">
        <SiderBarLayout />
        <div className="Content">
          {content}
        </div>
      </div>
      <Footer />
    </div>
  );
};