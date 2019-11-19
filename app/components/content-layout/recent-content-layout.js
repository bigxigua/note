import React, { Fragment, useEffect, useState } from 'react';
import RecentContent from '@components/recent-content';
import Empty from '@common/empty';
import axiosInstance from '@util/axiosInstance';

export default function RecentContentLayout() {
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    (async () => {
      const [error, data] = await axiosInstance.get('docs?type=recent&limit=200');
      if (error || !Array.isArray(data)) {
        console.log('[获取最近使用列表失败] ', error);
      } else {
        setDocs(data);
      }
    })();
  }, []);
  if (docs.length === 0) {
    return (
      <Fragment>
        <Empty />
        <div className="Recent_Content_Empty">暂无数据</div>
      </Fragment>
    );
  }
  return (
    <div className="Recent_Content_Layout">
      {
        docs.map(n => {
          return (
            <Fragment key={n.id}>
              <RecentContent {...n} />
            </Fragment>
          );
        })
      }
    </div>
  );
}