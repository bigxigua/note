import React, { Fragment, useEffect } from 'react';
import Icon from '@common/icon';
import { addKeydownListener } from '@util/util';
import './index.css';

const textKeys = {
  title: '文本格式快捷键',
  list: [{
    symbol: <img src="/images/text_bold.png" />,
    name: '加粗',
    keys: ['CMD', 'S']
  }, {
    symbol: <img src="/images/text_itailc.png" />,
    name: '斜体',
    keys: ['CMD', 'E']
  }, {
    symbol: <img src="/images/format_strikethrough.png" />,
    name: '删除线',
    keys: ['CMD', 'E']
  }, {
    symbol: <img src="/images/text_superscript.png" />,
    name: '上标',
    keys: ['CMD', 'E']
  }, {
    symbol: <img src="/images/text_subscript.png" />,
    name: '下标',
    keys: ['CMD', 'E']
  }, {
    symbol: <img src="/images/code_coding.png" />,
    name: '行内代码',
    keys: ['CMD', 'E']
  }]
};
const pageKeys = {
  title: '网页快捷键',
  list: [{
    symbol: <img src="/images/save.png" />,
    name: '保存',
    keys: ['CMD', 'S']
  }, {
    symbol: <img src="/images/preview.png" />,
    name: '预览',
    keys: ['CMD', 'E']
  }, {
    symbol: <img src="/images/red_undo.png" />,
    name: '撤销',
    keys: ['CMD', 'E']
  }, {
    symbol: <img src="/images/color_replacement.png" />,
    name: '查找并替换',
    keys: ['CMD', 'E']
  }, {
    symbol: <img src="/images/pictures.png" />,
    name: '插入图片',
    keys: ['CMD', 'E']
  }, {
    symbol: <img src="/images/link.png" />,
    name: '插入链接',
    keys: ['CMD', 'E']
  }, {
    symbol: <img src="/images/paste.png" />,
    name: '粘贴纯文本',
    keys: ['CMD', 'E']
  }]
};
const articleKeys = {
  title: '文本对齐快捷键',
  list: [{
    symbol: <img src="/images/left_alignment.png" />,
    name: '左对齐',
    keys: ['CMD', 'S']
  }, {
    symbol: <img src="/images/align_center.png" />,
    name: '居中对齐',
    keys: ['CMD', 'E']
  }, {
    symbol: <img src="/images/right_alignment.png" />,
    name: '右对齐',
    keys: ['CMD', 'E']
  }, {
    symbol: <img src="/images/align_justify.png" />,
    name: '两端对齐',
    keys: ['CMD', 'E']
  }]
};
export default function ShortcutKeys({
  visible,
  onClose = () => { }
}) {
  function renderKeys(info) {
    return (
      <div className="ShortcutKeys_Group">
        <h3>{info.title}</h3>
        {info.list.map((n, i) => {
          return <div className="flex"
            key={i}>
            <div className="ShortcutKeys_Char flex">
              <span>{n.symbol}</span>
              <span>{n.name}</span>
            </div>
            <div className="ShortcutKeys_key flex">
              {
                n.keys.map((k, index) => {
                  return <Fragment key={k}>
                    <span>{k}</span>
                    {index % 2 === 0 && <p>+</p>}
                  </Fragment>;
                })
              }
            </div>
          </div>;
        })}
      </div>
    );
  }
  useEffect(() => {
    const listener = addKeydownListener({
      handle: ({ keyCode }) => {
        if (keyCode === 27) {
          onClose(false);
        }
      }
    });
    return () => listener.remove();
  }, []);
  return (
    <div className={`ShortcutKeys animated ${visible ? 'ShortcutKeys_show' : ''}`}>
      <Icon
        onClick={() => { onClose(false); }}
        className="ShortcutKeys_close"
        type="close" />
      <h2>快捷键一览表</h2>
      {renderKeys(pageKeys)}
      {renderKeys(articleKeys)}
      {renderKeys(textKeys)}
    </div>
  );
};