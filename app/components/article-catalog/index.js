import React, { useEffect, useState } from 'react';
import { checkBrowser, getCatalogs } from '@util/util';
import './index.css';

const { isMobile } = checkBrowser();

function createCatalogsJsx(html) {
  if (!html) return null;
  return getCatalogs(html).map(p => {
    return (
      <div
        className="Catalog_item"
        key={p.index}>
        <a href={`#${p.id}`}
          className={'Catalog_item_' + p.type}>{p.text}</a>
      </div>
    );
  });
}

/**
 *  @editor {object} 编辑器对象
 */
export default function ArticleCatalog({
  html = '',
  style = {},
  className = ''
}) {
  const [catalogsJsx, setCatalogsJsx] = useState(null);

  useEffect(() => {
    setCatalogsJsx(createCatalogsJsx(html));
  }, [html]);

  if (isMobile || !Array.isArray(catalogsJsx) || catalogsJsx.length === 0) {
    return null;
  }

  return (
    <div
      className={`Article_Catalog_Wrapper ${className}`}
      style={style}>
      <div className="Catalog_title">文章目录</div>
      <div className="Catalog_box">{catalogsJsx}</div>
    </div>
  );
};