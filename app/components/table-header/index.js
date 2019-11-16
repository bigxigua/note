import React, { useState } from 'react';
import Dropdown from '@common/dropdown';
import Icon from '@common/icon';
import List from '@common/list';
import Button from '@common/button';
import Search from '@components/search';
import './index.css';

export default function TableHeader() {
  const isDocsPage = /^\/docs/g.test(window.location.pathname);
  const [types, setTypes] = useState([
    { text: '我创建的', code: 'ALL', checked: true },
    { text: '最近编辑的', code: 'RECENT' }]
  );
  const onListItemClick = (info, index) => {
    if (!info.checked) {
      setTypes(types.map((n, i) => {
        return {
          ...n,
          checked: i === index
        };
      }));
    }
  };
  const Overlay = <List
    list={types}
    onTap={onListItemClick} />;
  return (
    <div className="TableHeader flex">
      {isDocsPage && <Dropdown
        trigger="click"
        overlay={Overlay}>
        <p className="TableHeader_Title">{types.filter(n => n.checked)[0].text}</p>
        <Icon
          className="TableHeader_Icon_Down"
          type="down" />
      </Dropdown>}
      {!isDocsPage && <p className="TableHeader_Title">知识库</p>}
      <div className="TableHeader_Right flex">
        <Search />
        <Button type="primary">{isDocsPage ? '新建文档' : '新建知识库'}</Button>
      </div>
    </div>
  );
};