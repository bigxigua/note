import React, { useContext, useState } from 'react';
import userContext from '../../context/user/userContext.js';
import RecentContentLayout from './recent-content-layout.js';
import './index.css';

export default function ContentLayout() {
  const { userInfo } = useContext(userContext);
  const [showPopover, change] = useState(false);
  console.log(showPopover, change);
  console.log('userInfo:', userInfo);
  return (
    <div className="Content_Layout">
      <div className="Content_Layout_Head">
        <div className="Content_Layout_Recent_Edit">最近编辑</div>
        <button className="button">新建文档</button>
      </div>
      <RecentContentLayout />
    </div>
  );
};