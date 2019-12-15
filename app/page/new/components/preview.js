
import React from 'react';

const scenceMap = {
  DOCS: {
    title: '文档空间',
    subTitle: '提供结构化展示和目录编排功能，在线完成各种知识创作和分类。',
    img: ['/images/doc_preview_1.jpg', '/images/doc_preview_2.jpg'],
    desc: '可用用来记录读书笔记、帮助手册、日记、个人笔记、读书心得等场景'
  }
};

export default function Preview({
  space = ''
}) {
  const template = scenceMap[space.scene];
  if (!template) {
    return null;
  }
  return <div className="New_Preview">
    <div className="New_Preview_Header">
      <h2>{template.title}</h2>
      <h3>{template.subTitle}</h3>
    </div>
    {
      template.img.map((n, i) => {
        return <img
          className="New_Preview_Img"
          key={i}
          src={n} />;
      })
    }
    <p>使用场景</p>
    <div className="New_Preview_Desc">{template.desc}</div>
  </div>;
}