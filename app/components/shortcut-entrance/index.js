import React, { useState, useCallback, useEffect, useRef } from 'react';
import Button from '@common/button';
import axiosInstance from '@util/axiosInstance';
import ShortcutItems from './shortcut-items';
import Loading from '@common/loading';
import Modal from '@common/modal';
import Input from '@common/input';
import useMessage from '@hooks/use-message';
import { getIn } from '@util/util';
import './index.css';

const inputStyle = {
  width: '100%',
  height: '36px',
  marginBottom: '10px'
};

const message = useMessage();

function RenderContent({
  entries,
  setEntries,
  onCreateShortcut
}) {
  if (entries === null) {
    return <Loading />;
  } else if (entries.length === 0) {
    return <div className="shortcut-entrance__empty">在这里<span onClick={onCreateShortcut}>添加</span>常用链接</div>;
  } else {
    return <ShortcutItems
      setEntries={setEntries}
      onDelete={(id) => { setEntries(entries.filter(n => n.shortcut_id !== id)); }}
      entries={entries} />;
  }
};

function getShortcutType(url) {
  let type = 'NORMAL';
  if (/^https:\/\/www\.bigxigua\.net\/article\//.test(url)) {
    type = 'XIGUA_DOC';
  } else if (/^https:\/\/www\.bigxigua\.net\/spacedetail\?/.test(url)) {
    type = 'XIGUA_SPACE';
  }
  return type;
}

/**
  * 快捷入口组件
  * @param {string} className - 类名
*/
export default function ShortcutEntrance({
  className = ''
}) {
  const [entries, setEntries] = useState(null);
  const entryInfo = useRef({
    entryName: '',
    entryUrl: ''
  });
  const prefixClass = 'shortcut-entrance';

  // 获取快捷入口信息
  const fetchShortcut = useCallback(async () => {
    const [, data] = await axiosInstance.get('shortcut');
    if (Array.isArray(data)) {
      setEntries(data.sort((a, b) => a.order_num - b.order_num));
    }
  }, []);

  // 创建新快捷入口
  const createShortcutEntrance = useCallback(async ({ entryName, entryUrl }) => {
    if (!entryName || !entryUrl) {
      return;
    }
    const [error, data] = await axiosInstance.post('create/shortcut', {
      title: entryName,
      url: entryUrl,
      type: getShortcutType(entryUrl)
    });
    if (data && data.STATUS === 'OK') {
      setEntries([...(entries || []), data.data]);
    } else {
      message.error({ content: getIn(error, ['message'], '创建失败') });
    }
  }, [entries]);

  // 显示常见快捷入口的modal
  const onShowCreateShortcutEntranceModal = useCallback(() => {
    Modal.confirm({
      title: '添加快捷入口',
      subTitle: '添加快捷入口已方便查找和使用',
      content: (
        <div className="shortcut-entrance__modal">
          <Input
            addonBefore="标题"
            onChange={(e) => { entryInfo.current.entryName = e.currentTarget.value; }}
            style={inputStyle} />
          <Input
            addonBefore="URL地址"
            onChange={(e) => { entryInfo.current.entryUrl = e.currentTarget.value; }}
            style={inputStyle} />
        </div>),
      onOk: async () => {
        createShortcutEntrance(entryInfo.current);
      }
    });
  }, [entries]);

  useEffect(() => {
    fetchShortcut();
  }, []);

  return (
    <div
      className={$.trim(`${prefixClass} ${className}`)}
      style={{ minHeight: `${(entries || []).length * 48 + 75}px` }}>
      <div className="shortcut-entrance__head">
        <div>快捷入口</div>
        <Button
          content="添加快捷入口"
          onClick={onShowCreateShortcutEntranceModal} />
      </div>
      <div className="shortcut-entrance__content">
        <RenderContent
          setEntries={setEntries}
          onCreateShortcut={onShowCreateShortcutEntranceModal}
          entries={entries} />
      </div>
    </div>
  );
};