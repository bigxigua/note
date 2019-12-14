import React, { useState, Fragment, useEffect } from 'react';
import axiosInstance from '@util/axiosInstance';
import { NavLink } from 'react-router-dom';
import { parseUrlQuery } from '@util/util';
import './index.css';

export default function BookCatalog() {
  const { spaceId = '' } = parseUrlQuery();
  const [bookCatalog, setBookCatalog] = useState([]);
  async function fetchDocsBySpaceId() {
    const [error, data] = await axiosInstance.get(`space/docs?space_id=${spaceId}`);
    if (!error && data && Array.isArray(data.docs) && data.docs.length > 0) {
      setBookCatalog(data.docs);
    } else {
      console.log('[获取space下doc列表失败] ', error);
    }
  }
  useEffect(() => {
    fetchDocsBySpaceId();
  }, []);
  const bookCatalogJsx = bookCatalog.map(n => {
    return (
      <Fragment key={n.id}>
        <NavLink
          to={'/article' + n.url.split('article')[1]}
          exact
          className="BookCatalog_NavLink ellipsis"
          activeStyle={{
            fontWeight: 'bold',
            color: '#25b864'
          }}>
          {n.title}
        </NavLink>
      </Fragment>
    );
  });
  return (
    <div className="BookCatalog_Wrapper">
      {bookCatalogJsx}
    </div>
  );
};