import React, { Fragment, useEffect, useState } from 'react';
import RecentContent from '@components/recent-content';
import Empty from '@common/empty';
import axiosInstance from '@util/axiosInstance';

export default function RecentContentLayout() {
  const [recentLists, setRecentLists] = useState([]);
  useEffect(() => {
    (async () => {
      const [error, data] = await axiosInstance.get('/recents?limit=20');
      if (error || !Array.isArray(data)) {
        console.log('[获取最近使用列表失败] ', error);
      } else {
        setRecentLists(data);
      }
    })();
  }, []);
  if (recentLists.length === 0) {
    return <Empty />;
  }
  return (
    <div className="Recent_Content_Layout">
      {
        recentLists.map(n => {
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