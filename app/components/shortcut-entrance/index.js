import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import List from '@common/list';
import Icon from '@common/icon';
import Button from '@common/button';
import Popover from '@components/popover';
import './index.css';

function createList(info) {
  return [{
    text: '删除入口',
    key: 'remove',
    icon: 'delete',
    info
  }];
}

/**
  * 快捷入口组件
  * @param {string} className - 类名
*/
export default function ShortcutEntrance({
  className = ''
}) {
  const [entries, setEntries] = useState([{
    title: '哈哈',
    type: 'doc|space',
    id: '1'
  }]);
  const prefixClass = 'shortcut-entrance';
  const onPopoverItemClick = useCallback(() => {

  }, []);
  useEffect(() => {

  }, []);
  const entriesJsx = entries.map((info) => {
    return (
      <div
        key={info.id}
        className="shortcut-entrance__content-entry">
        <div className="shortcut-entrance__content-left">
          <img src="/images/book.png" />
          <Link to="/">我的文档</Link>
        </div>
        <Popover
          content={
            <List
              onTap={onPopoverItemClick}
              list={createList(info)} />
          }>
          <Icon type="ellipsis"
            className="shortcut-entrance__content-icon" />
        </Popover>
      </div>);
  });
  return (
    <div className={$.trim(`${prefixClass} ${className}`)}>
      <div className="shortcut-entrance__head">
        <div>快捷入口</div>
        <Button
          content="添加快捷入口"
          onClick={() => {
          }} />
      </div>
      <div className="shortcut-entrance__content">{entriesJsx}</div>
    </div>
  );
};