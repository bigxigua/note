import React, { useState, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import './index.css';
export default function BookCatalog() {
  const [bookCatalog] = useState([
    { id: 1, title: '标题一', link: '/article/1' },
    { id: 2, title: '哈哈哈哈哈哈哈哈哈哈哈啊啊哈哈哈哈哈哈哈哈哈哈哈哈哈啊啊哈哈', link: '/article/2' },
    { id: 3, title: '标题一', link: '/article/222' },
    { id: 4, title: '标题一', link: '/article/3' },
    { id: 5, title: '标题一', link: '/article/4' }
  ]);
  const bookCatalogJsx = bookCatalog.map(n => {
    return (
      <Fragment key={n.id}>
        <NavLink to={n.link}
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