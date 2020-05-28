import React, { useState, useCallback, useEffect } from 'react';
import './index.css';

export default function Dropdown({
  className = '',
  children,
  disabled = false, // 菜单是否禁用
  overlay = null, // 菜单
  // placement = 'bottomLeft', // 菜单弹出位置：bottomLeft bottomCenter bottomRight topLeft topCenter topRight
  trigger = 'hover', // 触发下拉的行为, hover/click
  visible = false, // 菜单是否默认显示
  onVisibleChange = () => { } // 菜单显示状态改变时调用，参数为 visible
}) {
  const classMaps = {
    hover: ' dropdown-hover'
  };
  const [expand, setExpand] = useState(visible);

  const onClick = useCallback(() => {
    if (disabled) {
      return;
    }
    if (trigger === 'click') {
      setExpand(!expand);
      onVisibleChange(!expand);
    }
  }, [expand, trigger, disabled]);

  useEffect(() => {
    setExpand(visible);
  }, [visible]);

  let prefixCls = $.trim(`Dropdown flex animated ${className}`);
  prefixCls += classMaps[trigger] || '';
  prefixCls += visible ? ' dropdown-overlay__visible' : '';
  prefixCls += expand ? ' dropdown-click__expand' : '';

  // TODO 改造为插入到body到形式。
  return (
    <div
      onClick={onClick}
      className={prefixCls}>
      {disabled && <div className="dropdown-disabled"></div>}
      <div className="dropdown-content flex">{children}</div>
      <div className="dropdown-overlay">
        {overlay}
      </div>
    </div>
  );
};