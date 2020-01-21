import React from 'react';
import './index.css';

export default function Footer({
  style = {}
}) {
  return (
    <div className="footer-wrapper"
      style={style}>
      <div className="flex footer-wrapper_Tip">
        <div className="flex">
          <img src="/images/watermelon.png" />
          <span>一日一记</span>
        </div>
        <span>生活点滴，记在这里。专属空间，私密体验。</span>
      </div>
      {/* <a href="http://www.beian.miit.gov.cn/">皖ICP备20000299号-1</a> */}
    </div>
  );
};