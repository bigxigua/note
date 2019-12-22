import React, { useEffect, useState, useContext } from 'react';
import editorContext from '@context/editor/editorContext';
import './index.css';

function createCatalogsJsx({ editormd, dynamic, setCatalogsJsx }) {
  if (!editormd) return;
  const catalogs = [];
  try {
    const $html = dynamic ? $(editormd.getHtmlFromMarkDown()) : $('.markdown-body').children();
    Array.from($html).forEach((dom, index) => {
      const tagName = dom.tagName;
      if (['H1', 'H2', 'H3', 'H4'].includes(tagName)) {
        catalogs.push({
          index,
          text: $(dom).children('a').attr('name'),
          id: $(dom).attr('id'),
          type: tagName.toLowerCase()
        });
      }
    });
  } catch (error) {
    console.log(error);
  }

  const catalogsJsx = catalogs.map(p => {
    return (
      <div
        className="Catalog_item"
        key={p.index}>
        <a href={`#${p.id}`}
          className={'Catalog_item_' + p.type}>{p.text}</a>
      </div>
    );
  });
  setCatalogsJsx(catalogsJsx);
}

/**
 *  @editor {object} 编辑器对象
 *  @dynamic {boolean} 是否需要动态同步修改后目录
 */
export default function ArticleCatalog({ dynamic = false }) {
  const [catalogsJsx, setCatalogsJsx] = useState(null);
  const { editor } = useContext(editorContext);
  const d = { getMarkdown: () => { } };

  useEffect(() => {
    createCatalogsJsx({ editormd: editor, dynamic, setCatalogsJsx });
  }, [(editor || d).getMarkdown()]);

  return (
    <div className="Article_Catalog_Wrapper">
      <div className="Catalog_title">文章目录</div>
      <div className="Catalog_box">{catalogsJsx}</div>
    </div>
  );
};