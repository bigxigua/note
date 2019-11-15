import React from 'react';
import Panel from './panel.js';
import './index.css';

export default function RightPanelLayout() {
  return (
    <div className="Right_Panel_Layout">
      {/* 待办 */}
      <div className="Right_Panel_Block_Head">
        <p>待办提醒</p>
        <button className="button">添加</button>
      </div>
      <Panel />
      {/* 常用地址 */}
      <div className="Right_Panel_Block_Head">
        <p>常用地址</p>
        <button className="button">添加</button>
      </div>
      <Panel />
      {/*  */}
    </div>
  );
};