import React from 'react';
import Icon from '@common/icon';

export function MenuItem({ type, text, checked, len, handle, index }) {
  let className = '';
  if (len > 1) {
    className = checked ? 'New_Permission_Checked' : '';
    className += ' New_Permission_Mul';
  } else {
    className = 'New_Permission_Show';
  }
  const onClick = () => {
    if (len > 1) {
      handle(index);
    }
  };
  return (
    <div
      className={`New_Permission flex ${className}`}
      onClick={onClick}>
      <Icon type={type} />
      <p>{text}</p>
      <Icon type={len === 1 ? 'down' : checked ? 'check' : ''} />
    </div>
  );
};

// 菜单
export const MENUS = [{
  type: 'stop',
  text: '仅自己可见',
  public: 'SELF',
  checked: true
}, {
  type: 'global',
  public: 'PUBLIC',
  text: '互联网可见'
}];

// typeScenes
export const TYPESCENES = [{
  icon: <img src="/images/book.png" />,
  title: '文档知识库',
  desc: '创作在线文档',
  scene: 'DOCS',
  actived: true
}, {
  icon: <img src="/images/books.png" />,
  title: '资源知识库',
  disabled: true,
  scene: 'RESOURCE',
  desc: '上传并预览知识库'
}, {
  icon: <img src="/images/import.png" />,
  title: '导入',
  disabled: true,
  scene: 'IMPORT',
  desc: '新建并导入本地内容'
}];

// TEMPLATE_SCENCE
export const TEMPLATE_SCENCE = [{
  icon: <img src="/images/doc.png" />,
  title: '学习笔记',
  disabled: true,
  scene: 'TEMPLATE_OF_STUDY',
  desc: '点滴学习，随时记录'
}, {
  icon: <img src="/images/blog.png" />,
  title: '博客专栏',
  disabled: true,
  scene: 'TEMPLATE_OF_BLOG',
  desc: '定时总结，与人分享，加深记忆'
}, {
  icon: <img src="/images/trip.png" />,
  title: '旅行攻略',
  disabled: true,
  scene: 'TEMPLATE_OF_TRAVEL',
  desc: '行程单、预算、游记'
}];
