import React, { useState, useEffect, useCallback, useRef } from 'react';
import Tooltip from '@common/tooltip';
import Icon from '@common/icon';
import { NavLink } from 'react-router-dom';
import { isEmptyObject } from '@util/util';

const activeStyle = {
  fontWeight: 'bold',
  color: '#25b864'
};

// 渲染目录项
function renderCatalogItem(type, doc) {
  const cls = 'bookcatalog ellipsis';
  return type.toLocaleUpperCase() === 'EMPTY_NODE'
    ? <Tooltip className={cls}
      tips="空节点">
      <span>{doc.title}</span>
    </Tooltip>
    : <NavLink
      to={'/article' + doc.url.split('article')[1]}
      exact
      className={cls}
      activeStyle={activeStyle}>
      {doc.title}
    </NavLink>;
}

export function renderCatalogs(catalog, docs, onToggleExpandCatalog) {
  function recursion(data) {
    let result = [];
    // console.log(data);
    data.forEach((item, index) => {
      const doc = docs.find(n => n.doc_id === item.docId) || {};
      const isParenrt = item.children.length > 0;
      let classes = 'bookcatalog-item flex ';
      classes += `${item.open ? 'bookcatalog-item__open' : ''} `;
      classes += `${isParenrt ? 'bookcatalog-item_Parent' : ''} `;
      if (isEmptyObject(doc)) {
        return null;
      }
      result.push(<div
        key={item.docId}
        style={{ left: `${Math.min(item.level, 3) * 10}px` }}
        className={$.trim(classes)}>
        {isParenrt && <Icon
          onClick={() => { onToggleExpandCatalog(catalog, item, index); }}
          type="caret-down" />}
        {renderCatalogItem(item.type, doc)}
      </div>);
      if (item.children.length && item.isOpen) {
        result = result.concat(recursion(item.children));
      }
    });
    return result;
  }
  return recursion(catalog);
}