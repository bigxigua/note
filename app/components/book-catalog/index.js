import React, { useState, useEffect, useCallback, useRef } from 'react';
import Icon from '@common/icon';
import CatalogSkeleton from '@components/catalog-skeleton';
import axiosInstance from '@util/axiosInstance';
import { NavLink } from 'react-router-dom';
import { parseUrlQuery, getIn, isEmptyObject } from '@util/util';
import { extractCatalog, toggleExpandCatalog } from '@util/commonFun';
import './index.css';

export default function BookCatalog() {
  const { spaceId = '' } = parseUrlQuery();
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
      setBookCatalog({
        catalog: extractCatalog(catalog.slice(1)),
        docs: data.docs
      });
    } else {
      console.log('[获取space下doc列表失败] ', error);
    }
  }, []);

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
  }, []);

  const { docs, catalog } = bookCatalog;

  if (loading.current) {
    return <div className="BookCatalog_Wrapper"><CatalogSkeleton /></div>;
  }

  const activeStyle = {
    fontWeight: 'bold',
    color: '#25b864'
  };

  const bookCatalogJsx = catalog.map((item, index) => {
    const doc = docs.find(n => n.doc_id === item.docId) || {};
    const isParenrt = item.children.length > 0;
    const classes = `BookCatalog_Item flex ${item.open ? 'BookCatalog_Item_Open' : ''} ${isParenrt ? 'BookCatalog_Item_Parent' : ''}`;
    if (isEmptyObject(doc)) {
      return null;
    }
    return <div
      key={item.docId}
      style={{ left: `${Math.min(item.level, 3) * 10}px` }}
      className={classes}>
      {isParenrt && <Icon
        onClick={() => { onToggleExpandCatalog(catalog, item, index); }}
        type="caret-down" />}
      <NavLink
        to={'/article' + doc.url.split('article')[1]}
        exact
        className="BookCatalog_NavLink ellipsis"
        activeStyle={activeStyle}>
        {doc.title}
      </NavLink>
    </div>;
  });
  return (
    <div className="BookCatalog_Wrapper">
      {bookCatalogJsx}
    </div>
  );
};