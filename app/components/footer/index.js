import React from 'react';
import './index.css';

export default function Footer({
  style = {}
}) {
  return (
    <footer className="footer-wrapper"
      style={style}>
      <div className="footer-wrapper_tip">
        <div className="flex">
          <img src="/images/watermelon.png" />
          <span>一日一记</span>
        </div>
        <span>生活点滴，记在这里。专属空间，私密体验。</span>
        <a
          className="footer-icp"
          href="http://www.beian.miit.gov.cn/">ICP备案号：皖ICP备20000299号-1</a>
      </div>
    </footer>
  );
};