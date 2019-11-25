import React, { useState } from 'react';
import ShortcutKeys from '@components/shortcut-keys';
import './index.css';

export default function SiderTips() {
  const [visible, setVisible] = useState(false);
  function onShowKeyBoard(stat) {
    setVisible(stat);
  }
  return (
    <div className="SiderTips">
      <div className="SiderTips_block"
        onClick={() => { onShowKeyBoard(true); }}>
        <img src="/images/keyboard.png" />
        <span>快捷键</span>
      </div>
      <ShortcutKeys visible={visible}
        onClose={onShowKeyBoard} />
    </div>
  );
};