import React, { useCallback, useState, useEffect } from 'react';
import Popover from '@components/popover';
import Icon from '@common/icon';
import List from '@common/list';
import { useHistory } from 'react-router-dom';
import './index.css';

const defaultLists = [{
  text: '最近编辑',
  key: 'index'
}, {
  text: '知识库',
  key: 'space'
}, {
  text: '文档列表',
  key: 'docs'
}];

export default function MobileNav({ defaultCurrent = 'index' }) {
  const history = useHistory();
  const [current, setCurrent] = useState(defaultCurrent);

  const list = defaultLists.map(n => {
    return {
      ...n,
      checked: n.key === current
    };
  });

  useEffect(() => {
    setCurrent(defaultCurrent);
  }, [defaultCurrent]);

  const onPopoverItemClick = useCallback((info) => {
    setCurrent(info.key);
    history.push(`/${info.key}`);
  }, []);

  const text = list.filter(n => n.checked)[0].text;

  return <Popover
    className="content-recent-edit-m"
    content={
      <List
        style={{ boxShadow: 'none', padding: 0 }}
        onTap={(info, index, event) => { onPopoverItemClick(info, event); }}
        list={list} />
    }>
    <span className="content-recent-edit-m-text">{text}</span>
    <Icon className="content-recent-edit-m-icon"
      type="caret-down" />
  </Popover>;
};