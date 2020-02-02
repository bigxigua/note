import React, { useEffect, useState, useCallback } from 'react';
import { checkBrowser, getCatalogs } from '@util/util';
import './index.css';

function getOffset(data) {
  if (data.find(n => n.type === 'h1')) {
    return 0;
  } else if (data.find(n => n.type === 'h2')) {
    return -16;
  } else if (data.find(n => n.type === 'h3')) {
    return -32;
  } else if (data.find(n => n.type === 'h4')) {
    return -48;
  } else {
    return -64;
  }
}

function createCatalogsJsx(html, handle) {
  if (!html) return null;
  const catalogs = getCatalogs(html);

  return catalogs.map(p => {
    const i = parseInt(p.type.substr(1));
    return (<li
      className={`catalog-item catalog-item_${p.id}`}
      key={p.index}
      style={{ paddingLeft: `${(i - 1) * 16 + getOffset(catalogs) + 14}px` }}
      onClick={(e) => { handle(e, p.id); }}>
      {p.text}
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

  const onCatalogItemClick = useCallback((e, id) => {
    if (!id || $(`#${id}`).length === 0) return;
    $('html, body').animate({
      scrollTop: $(`#${id}`).offset().top - 58
    }, 400);
    window.location.hash = id;
  }, []);

  useEffect(() => {
    setCatalogsJsx(createCatalogsJsx(html, onCatalogItemClick));
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