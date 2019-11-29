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
  onSomeThingClick = () => { }
}) {
  const isDocsPage = /^\/docs/g.test(window.location.pathname);
  const history = useHistory();
  const [types, setTypes] = useState([
    { text: '所有文档', code: 'ALL', checked: true },
    { text: '已更新的', code: 'UPDATED' },
    { text: '未更新的', code: 'UN_UPDATED' },
    { text: '已删除的', code: 'DELETE' }
  ]
  );
  const [visible, setVisible] = useState(false);
  // 切换查看的文档类型
  function onListItemClick(info, index) {
    if (!info.checked) {
      onSomeThingClick('TYPE_CHANGE', info);
      setTypes(types.map((n, i) => {
        return {
          ...n,
          checked: i === index
        };
      }));
    }
  };
  // 确认搜索
  function onSearchEnter(value) {
    const { code } = types.filter(n => n.checked)[0];
    if (/^\s+$/.test(value)) {
      return;
    }
    onSomeThingClick('SEARCH_CHANGE', { code, q: value });
  };
  // 显示新建文档modal
  function onCreateDoc(stat) {
    setVisible(stat);
  };
  // 新建文档/新建知识库
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