import React from 'react';
import './index.css';

export default function Footer({
  style = {}
}) {
  return (
    <div className="Footer_Wrapper flex"
      style={style}>
      <div className="flex Footer_Wrapper_Tip">
        <div className="flex">
          <img src="/images/watermelon.png" />
          <span>一日一记</span>
        </div>
        <span>生活点滴，记在这里。专属空间，私密体验。</span>
      </div>
      {/* TODO 这里弄联系方式 */}
    </div>
  );
};