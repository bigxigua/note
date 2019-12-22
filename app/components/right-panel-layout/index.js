import React from 'react';
import Panel from './panel.js';
import './index.css';

export default function RightPanelLayout() {
  return null;
  return (
    <div className="Right_Panel_Layout">
      <div className="Right_Panel_Block_Head">
        <p>待办提醒</p>
        <button className="button">待办理</button>
      </div>
      <Panel />
    </div>
  );
};