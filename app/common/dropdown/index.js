import React, { useState } from 'react';
import './index.css';

export default function Dropdown(props) {
  const {
    disabled = false, // 菜单是否禁用
    overlay = null, // 菜单
    // placement = 'bottomLeft', // 菜单弹出位置：bottomLeft bottomCenter bottomRight topLeft topCenter topRight
    trigger = 'hover', // 触发下拉的行为, hover/click
    visible = false, // 菜单是否默认显示
    onVisibleChange = () => { } // 菜单显示状态改变时调用，参数为 visible
  } = props;
  const classMaps = {
    hover: 'Dropdown_Hover',
    click: ''
  };
  const [expand, setExpand] = useState(visible);
  const onClick = () => {
    if (trigger === 'click') {
      setExpand(!expand);
      onVisibleChange(!expand);
    }
  };
  const overlayVisibleClass = visible ? 'Dropdown_Overlay_Visible' : '';
  const overlayClickClass = expand ? 'Dropdown_Click_Expand' : '';
  // TODO 改造为插入到body到形式。
  return (
    <div
      onClick={onClick}
      className={`Dropdown flex animated ${classMaps[trigger]} ${overlayVisibleClass} ${overlayClickClass}`}>
      {disabled && <div className="Dropdown_disabled"></div>}
      <div className="Dropdown_Child flex">{props.children}</div>
      <div className="Dropdown_Overlay">
        {overlay}
      </div>
    </div>
  );
};