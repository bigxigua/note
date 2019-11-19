import React, { useState } from 'react';
import Dropdown from '@common/dropdown';
import Icon from '@common/icon';
import List from '@common/list';
import Button from '@common/button';
import Search from '@components/search';
import { useHistory } from 'react-router-dom';
import CreateDoc from '@components/create-doc';
import './index.css';

export default function TableHeader({
  onSomeThingClick = () => {}
}) {
  const isDocsPage = /^\/docs/g.test(window.location.pathname);
  const history = useHistory();
  const [types, setTypes] = useState([
    { text: '我创建的', code: 'ALL', checked: true },
    { text: '最近编辑的', code: 'RECENT' }]
  );
  const [visible, setVisible] = useState(false);
  function onListItemClick (info, index) {
    if (!info.checked) {
      onSomeThingClick('TYPE_CHANGE', types.filter(n => !n.checked)[0]);
      setTypes(types.map((n, i) => {
        return {
          ...n,
          checked: i === index
        };
      }));
    }
  };
  function onSearchEnter(value) {
    const { code } = types.filter(n => n.checked)[0];
    onSomeThingClick('SEARCH_CHANGE', { code, q: value });
  };
  function onCreateDoc(stat) {
    setVisible(stat);
  };
  function onButtonClick() {
    if (isDocsPage) {
      return onCreateDoc(true);
    }
    history.push('/new');
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
        <Search
          onEnter={onSearchEnter} />
        <Button type="primary"
          onClick={onButtonClick}>
          {isDocsPage ? '新建文档' : '新建知识库'}
        </Button>
      </div>
      {visible && <CreateDoc onModalChange={onCreateDoc} />}
    </div>
  );
};