import React from 'react';
import Footer from '@components/footer';
import './index.css';

export default function Mobile404({
  style = {},
  className = '',
  title = undefined,
  subTitle = undefined
}) {
  return (
    <div style={style}
      className={`mobile_404 ${className}`}>
      <div className="mobile_404_content">
        <img src="/images/404.svg" />
        <p>{title === undefined ? '从前有座山，山里有座庙，庙里有个页面，现在找不到...' : title}</p>
        <div>{subTitle === undefined ? '页面链接错误或被删除' : subTitle}</div>
      </div>
      <Footer />
    </div>
  );
};
