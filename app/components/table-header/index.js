import React, { useState, useCallback } from 'react';
import Dropdown from '@common/dropdown';
import Icon from '@common/icon';
import List from '@common/list';
import Button from '@common/button';
import Search from '@components/search';
import MobileNav from '@components/mobile-nav';
import { useHistory } from 'react-router-dom';
import CreateDoc from '@components/create-doc';
import { checkBrowser } from '@util/util';
import './index.css';

const { isMobile } = checkBrowser();

export default function TableHeader({
  onSomeThingClick = () => { }
}) {
  const history = useHistory();
  const [types, setTypes] = useState([
    { text: '所有文档', code: 'ALL', checked: true },
    { text: '已更新的', code: 'UPDATED' },
    { text: '未更新的', code: 'UN_UPDATED' },
    { text: '已删除的', code: 'DELETE' }
  ]);
  const [visible, setVisible] = useState(false);
  const isDocsPage = /^\/docs/g.test(window.location.pathname);

  // 切换查看的文档类型
  const onListItemClick = useCallback((info, index) => {
    if (!info.checked) {
      onSomeThingClick('TYPE_CHANGE', info);
      setTypes(types.map((n, i) => {
        return {
          ...n,
          checked: i === index
        };
      }));
    }
  }, []);

  // 确认搜索
  const onSearchEnter = useCallback((value) => {
    const { code } = types.filter(n => n.checked)[0];
    if (/^\s+$/.test(value)) {
      return;
    }
    onSomeThingClick('SEARCH_CHANGE', { code, q: value });
  }, []);

  // 新建文档/新建知识库
  const onButtonClick = useCallback(() => {
    if (isDocsPage) {
      return setVisible(true);
    }
    history.push('/new');
  }, [isDocsPage]);

  const Overlay = <List
    list={types}
    onTap={onListItemClick} />;
  const tableHeaderClasses = 'TableHeader flex ';

  // 移动端渲染条目
  if (isMobile) {
    return <div className="table-header-mobile">
      <div className="flex table-header-mobile-head">
        <MobileNav defaultCurrent={isDocsPage ? 'docs' : 'space'} />
        <Button type="primary"
          onClick={onButtonClick}>
          {isDocsPage ? '新建文档' : '新建知识库'}
        </Button>
      </div>
      <Search
        placeholder="输入标题内容进行搜索"
        onEnter={onSearchEnter} />
      {visible && <CreateDoc onModalChange={(a) => { setVisible(a); }} />}
    </div>;
  }
  // pc端
  return (
    <div className={tableHeaderClasses}>
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
          placeholder="输入标题内容进行搜索"
          onEnter={onSearchEnter} />
        <Button type="primary"
          onClick={onButtonClick}>
          {isDocsPage ? '新建文档' : '新建知识库'}
        </Button>
      </div>
      {visible && <CreateDoc onModalChange={(a) => { setVisible(a); }} />}
    </div>
  );
};