import React, { useState, useEffect, useCallback, useRef } from 'react';
import Icon from '@common/icon';
import Tooltip from '@common/tooltip';
// import CatalogSkeleton from '@components/catalog-skeleton';
import axiosInstance from '@util/axiosInstance';
import { NavLink } from 'react-router-dom';
import { parseUrlQuery, getIn, isEmptyObject } from '@util/util';
import { extractCatalog, toggleExpandCatalog } from '@util/commonFun';
import { renderCatalogs } from './handle';
import './index.css';

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

export default function BookCatalog() {
  const { spaceId = '' } = parseUrlQuery();
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  // const [loading, setLoading] = useState(false);
  const loading = useRef(false);
  const [bookCatalog, setBookCatalog] = useState({
    docs: [],
    catalog: []
  });

  // 获取属于同一空间的文档列表
  const fetchDocsBySpaceId = useCallback(async () => {
    loading.current = true;
    const [error, data] = await axiosInstance.get(`space/docs?space_id=${spaceId}`);
    loading.current = false;
    const catalog = JSON.parse(getIn(data, ['space', 'catalog'], '[]'));
    if (catalog.length > 1) {
      const extra = extractCatalog(catalog.slice(1));
      // const current = expandToTarget(docId, extra);
      setBookCatalog({
        catalog: extra,
        docs: data.docs
      });
    } else {
      console.log('[获取space下doc列表失败] ', error);
    }
  }, [docId]);

  // 点击章节目录展开or收起子目录
  const onToggleExpandCatalog = useCallback((trees, item, index) => {
    toggleExpandCatalog({ trees, item, index }, (result) => {
      setBookCatalog({
        catalog: result,
        docs: bookCatalog.docs
      });
    });
  }, [bookCatalog.docs]);

  useEffect(() => {
    fetchDocsBySpaceId();
  }, [spaceId]);

  const { docs, catalog } = bookCatalog;
  if (loading.current) {
    return <div className="bookcatalog-wrapper"></div>;
    // return <div className="bookcatalog-wrapper"><CatalogSkeleton /></div>;
  }

  const bookCatalogJsx = catalog.map((item, index) => {
    const doc = docs.find(n => n.doc_id === item.docId) || {};
    const isParenrt = item.children.length > 0;
    let classes = 'bookcatalog-item flex ';
    classes += `${item.open ? 'bookcatalog-item__open' : ''} `;
    classes += `${isParenrt ? 'bookcatalog-item_Parent' : ''} `;
    if (isEmptyObject(doc)) {
      return null;
    }
    return <div
      key={item.docId}
      style={{ left: `${Math.min(item.level, 3) * 10}px` }}
      className={$.trim(classes)}>
      {isParenrt && <Icon
        onClick={() => { onToggleExpandCatalog(catalog, item, index); }}
        type="caret-down" />}
      {renderCatalogItem(item.type, doc)}
    </div>;
  });
  const a = renderCatalogs(catalog, docs);
  console.log(a);
  return (
    <nav className="bookcatalog-wrapper">
      <div className="bookcatalog-content">
        {bookCatalogJsx}
      </div>
    </nav>
  );
};