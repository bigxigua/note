import React, { useCallback } from 'react';
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
  text: '文档',
  key: 'docs'
}, {
  text: '其他',
  key: 'other'
}];

export default function MobileNav({ current = 'index' }) {
  const history = useHistory();

  const list = defaultLists.map(n => {
    return {
      ...n,
      checked: n.key === current
    };
  });

  const onPopoverItemClick = useCallback((info) => {
    history.push(info.key);
  }, []);

  return <Popover
    className="content-recent-edit-m"
    content={
      <List
        style={{ boxShadow: 'none', padding: 0 }}
        onTap={(info, index, event) => { onPopoverItemClick(info, event); }}
        list={list} />
    }>
    <span className="content-recent-edit-m-text">最近编辑</span>
    <Icon className="content-recent-edit-m-icon"
      type="caret-down" />
  </Popover>;
};