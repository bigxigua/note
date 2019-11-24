import React from 'react';
import Icon from '@common/icon';
import './index.css';

export default function ShortcutKeys({
  visible,
  onClose = () => { }
}) {
  function renderKeys(info) {
    return (
      <div className="ShortcutKeys_Group">
        <h3>{info.title}</h3>
        <div className="flex">
          <div>

          </div>
        </div>
      </div>
    );
  }
  const pagekeys = {
    title: '网页快捷键',
    list: []
  };
  return (
    <div className={`ShortcutKeys ${visible ? 'ShortcutKeys_show' : ''}`}>
      <Icon
        onClick={() => { onClose(false); }}
        className="ShortcutKeys_close"
        type="close" />
      <h2>快捷键一览表</h2>
      {renderKeys(pagekeys)}
    </div>
  );
};