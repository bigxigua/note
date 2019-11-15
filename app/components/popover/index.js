import React from 'react';
import './index.css';

export default function Popover(props) {
  return (
    <div className={`Popover_Wrapper flex ${props.className || ''}`}>
      <div className="Popover_Wrapper_Child flex">{props.children}</div>
      <div className="Popover_Wrapper_Content animated">{props.content}</div>
    </div>
  );
};