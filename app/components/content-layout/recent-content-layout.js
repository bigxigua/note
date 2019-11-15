import React, { Fragment, useEffect, useState } from 'react';
import RecentContent from '../recent-content/index.js';
import axiosInstance from '../../util/axiosInstance';

export default function RecentContentLayout() {
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    (async () => {
      const [error, data] = await axiosInstance.get('recent');
      if (error || !data || !Array.isArray(data.docs)) {
        console.log('[获取最近使用列表失败] ', error);
      } else {
        setDocs(data.docs);
      }
    })();
  }, []);
  if (docs.length === 0) {
    return (
      <div className="Recent_Content_Empty">暂无数据</div>
    );
  }
  return (
    <div className="Recent_Content_Layout">
      {
        docs.map(n => {
          return (
            <Fragment key={n.id}>
              <RecentContent data={n} />
            </Fragment>
          );
        })
      }
    </div>
  );
}