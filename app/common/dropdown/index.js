import React from 'react';
import './index.css';

export default function Dropdown(props) {
  const {
    disabled = false, // 菜单是否禁用
    overlay = null, // 菜单
    // placement = 'bottomLeft', // 菜单弹出位置：bottomLeft bottomCenter bottomRight topLeft topCenter topRight
    trigger = 'hover', // 触发下拉的行为, hover/click
    visible = false, // 菜单是否默认显示
    onVisibleChange = () => {} // 菜单显示状态改变时调用，参数为 visible
  } = props;
  const classMaps = {
    hover: 'Dropdown_Hover',
    click: 'Dropdown_Click'
  };
  const overlayClass = visible ? 'Dropdown_Overlay_Visible' : '';
  return (
    <div className={`Dropdown animated ${classMaps[trigger]} ${overlayClass}`}>
      {disabled && <div className="Dropdown_disabled"></div>}
      <div className="Dropdown_Child">{props.children}</div>
      <div className="Dropdown_Overlay">
        {overlay}
      </div>
    </div>
  );
};