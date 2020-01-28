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
      className={`container ${className}`}
      style={style}>
      <Header />
      <div className="content-wrapper_index">
        <SiderBarLayout />
        <div className="content">
          {content}
        </div>
      </div>
      <Footer />
    </div>
  );
};