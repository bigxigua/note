import React, { useEffect, useState, useCallback } from 'react';
import { checkBrowser, getCatalogs } from '@util/util';
import './index.css';

function createCatalogsJsx(html, handle) {
  if (!html) return null;
  return getCatalogs(html).map(p => {
    return (<li
      className={`catalog-item catalog-item_${p.id} catalog-item_${p.type}`}
      key={p.index}
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