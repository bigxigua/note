import React, { useState, Fragment, useEffect, useCallback } from 'react';
import Icon from '@common/icon';
import axiosInstance from '@util/axiosInstance';
import { NavLink } from 'react-router-dom';
import { parseUrlQuery, getIn, isEmptyObject } from '@util/util';
import { extractCatalog, toggleExpandCatalog } from '@util/commonFun';
import './index.css';

export default function BookCatalog() {
  const { spaceId = '' } = parseUrlQuery();
  const [bookCatalog, setBookCatalog] = useState({
    docs: [],
    catalog: []
  });
  const fetchDocsBySpaceId = useCallback(async () => {
    const [error, data] = await axiosInstance.get(`space/docs?space_id=${spaceId}`);
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
  if (docs.length === 0 || catalog.length === 0) {
    return null;
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
  // const bookCatalogJsx = bookCatalog.map(n => {
  //   return (
  //     <Fragment key={n.id}>
  // <NavLink
  //   to={'/article' + n.url.split('article')[1]}
  //   exact
  //   className="BookCatalog_NavLink ellipsis"
  //   activeStyle={{
  //     fontWeight: 'bold',
  //     color: '#25b864'
  //   }}>
  //   {n.title}
  // </NavLink>
  //     </Fragment>
  //   );
  // });
  return (
    <div className="BookCatalog_Wrapper">
      {bookCatalogJsx}
    </div>
  );
};