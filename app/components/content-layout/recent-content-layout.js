import React, { Fragment } from 'react';
import RecentContent from '../recent-content/index.js';

export default function RecentContentLayout() {
  const lists = [
    { id: '2', title: '无标题', updated_at: '2019-11-08', user: { name: '哈哈哈' }, book: { name: '科学与伪科学' } },
    { id: '2', title: '无标题', updated_at: '2019-11-08', user: { name: '哈哈哈' }, book: { name: '科学与伪科学' } },
    { id: '2', title: '无标题', updated_at: '2019-11-08', user: { name: '哈哈哈' }, book: { name: '科学与伪科学' } },
    { id: '2', title: '无标题', updated_at: '2019-11-08', user: { name: '哈哈哈' }, book: { name: '科学与伪科学' } }
  ];
  const listsJsx = lists.map(n => {
    return (
      <Fragment key={n.id}>
        <RecentContent data={n} />
      </Fragment>
    );
  });
  return (
    <div className="Recent_Content_Layout">
      {listsJsx}
    </div>
  );
}