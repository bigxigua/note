import React, { useEffect, useState } from 'react';
import { checkBrowser, getCatalogs } from '@util/util';
import './index.css';

function createCatalogsJsx(html) {
  if (!html) return null;
  return getCatalogs(html).map(p => {
    return (<li className="catalog-item"
      key={p.index}>
      <a href={`#${p.id}`}
        className={'catalog-item_' + p.type}> {p.text}
      </a>
    </li>);
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
  const { isMobile } = checkBrowser();

  useEffect(() => {
    setCatalogsJsx(createCatalogsJsx(html));
  }, [html]);

  if (isMobile || !Array.isArray(catalogsJsx) || catalogsJsx.length === 0) {
    return null;
  }
  return (
    <div
      className={`catalog-wrapper ${className}`}
      style={style}>
      <div className="catalog-title">文章目录</div>
      <ul className="catalog-box"> {catalogsJsx} </ul>
    </div>);
};