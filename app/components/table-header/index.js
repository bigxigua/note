import React, { useState, useCallback } from 'react';
import { Icon, List, Dropdown, Button } from 'xigua-components/dist/js';
import Search from '@components/search';
import MobileNav from '@components/mobile-nav';
import { useHistory } from 'react-router-dom';
import CreateDocButtton from '@components/create-doc-button';
import { checkBrowser } from '@util/util';
import './index.css';

export default function TableHeader({
  onSomeThingClick = () => { }
}) {
  const { isMobile } = checkBrowser();
  const history = useHistory();
  const [value, setValue] = useState('');
  const [types, setTypes] = useState([
    { text: '所有文档', code: 'ALL', checked: true },
    { text: '已更新的', code: 'UPDATED' },
    { text: '未更新的', code: 'UN_UPDATED' },
    { text: '已删除的', code: 'DELETE' }
  ]);
  const isDocsPage = /^\/docs/g.test(window.location.pathname);

  // 切换查看的文档类型
  const onListItemClick = useCallback((info, index) => {
    if (!info.checked) {
      onSomeThingClick('TYPE_CHANGE', {
        ...info,
        q: value
      });
      setTypes(types.map((n, i) => {
        return {
          ...n,
          checked: i === index
        };
      }));
    }
  }, [value]);

  // 确认搜索
  const onSearchEnter = useCallback((value) => {
    const { code } = types.filter(n => n.checked)[0];
    if (/^\s+$/.test(value)) {
      return;
    }
    onSomeThingClick('SEARCH_CHANGE', { code, q: value });
  }, []);

  const onChange = useCallback((e) => {
    setValue(e.currentTarget.value);
  }, []);

  const Overlay = <List
    list={types}
    onTap={onListItemClick} />;

  const tableHeaderClasses = 'table-header flex ';

  // 移动端渲染条目
  if (isMobile) {
    return <div className="table-header-mobile">
      <div className="flex table-header-mobile-head">
        <MobileNav defaultCurrent={isDocsPage ? 'docs' : 'space'} />
        {
          isDocsPage
            ? <CreateDocButtton />
            : <Button
              type="primary"
              content="新建知识库"
              onClick={() => { history.push('/new'); }}>
            </Button>
        }
      </div>
      <Search
        placeholder="输入关键字搜索"
        onEnter={onSearchEnter} />
    </div>;
  }
  // pc端
  return (
    <div className={tableHeaderClasses}>
      {isDocsPage && <Dropdown
        trigger="click"
        overlay={Overlay}>
        <p className="table-header__title">{types.filter(n => n.checked)[0].text}</p>
        <Icon
          className="table-header__icon"
          type="caret-down" />
      </Dropdown>}
      {!isDocsPage && <p className="table-header__title">知识库</p>}
      <div className="table-header__right flex">
        <Search
          onChange={onChange}
          placeholder="输入关键字搜索"
          onEnter={onSearchEnter} />
        {
          isDocsPage
            ? <CreateDocButtton />
            : <Button
              type="primary"
              content="新建知识库"
              onClick={() => { history.push('/new'); }}>
            </Button>
        }
      </div>
    </div>
  );
};