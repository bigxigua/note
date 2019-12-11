import React, { useState } from 'react';
import ShortcutKeys from '@components/shortcut-keys';
import './index.css';

export default function SiderTips() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="SiderTips">
      <div className="SiderTips_block"
        onClick={() => { setVisible(true); }}>
        <img src="/images/keyboard.png" />
        <span>快捷键</span>
      </div>
      <ShortcutKeys visible={visible}
        onClose={(stat) => { setVisible(stat); }} />
    </div>
  );
};