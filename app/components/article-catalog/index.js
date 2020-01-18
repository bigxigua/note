import React, { useEffect, useState, useContext } from 'react';
import editorContext from '@context/editor/editorContext';
import { checkBrowser, getCatalogs } from '@util/util';
import './index.css';

const { isMobile } = checkBrowser();

function createCatalogsJsx({ editormd, dynamic, setCatalogsJsx, catalogsUpdate }) {
  if (!editormd) return;
  const catalogs = getCatalogs(editormd, dynamic);

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
  catalogsUpdate(catalogsJsx);
  setCatalogsJsx(catalogsJsx);
}

/**
 *  @editor {object} 编辑器对象
 *  @dynamic {boolean} 是否需要动态同步修改后目录
 */
export default function ArticleCatalog({ dynamic = false, catalogsUpdate = () => { } }) {
  const [catalogsJsx, setCatalogsJsx] = useState(null);
  const { editor } = useContext(editorContext);
  const noop = { getValue: () => { } };

  useEffect(() => {
    createCatalogsJsx({ editormd: editor, dynamic, setCatalogsJsx, catalogsUpdate });
  }, [(editor || noop).getValue()]);

  if (isMobile || !Array.isArray(catalogsJsx) || catalogsJsx.length === 0) {
    return null;
  }

  return (
    <div className="Article_Catalog_Wrapper">
      <div className="Catalog_title">文章目录</div>
      <div className="Catalog_box">{catalogsJsx}</div>
    </div>
  );
};