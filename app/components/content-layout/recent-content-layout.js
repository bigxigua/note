import React, { Fragment, useEffect, useState, useCallback } from 'react';
import RecentContent from '@components/recent-content';
import { Empty, Loading } from 'xigua-components/dist/js';
import axiosInstance from '@util/axiosInstance';

export default function RecentContentLayout() {
  const [recentLists, setRecentLists] = useState(null);

  useEffect(() => {
    (async () => {
      const [error, data] = await axiosInstance.get('/recents?limit=20');
      if (error || !Array.isArray(data)) {
        setRecentLists([]);
        console.log('[获取最近使用列表失败] ', error);
      } else {
        setRecentLists(data);
      }
    })();
  }, []);

  const onRecentAction = useCallback((type, { id }) => {
    const list = recentLists.slice(0);
    const index = list.findIndex(n => n.id === id);
    list.splice(index, 1);
    setRecentLists(list);
  }, [recentLists]);

  // 正在获取最近编辑列表
  if (!recentLists) {
    return <Loading show={true} />;
  }

  return (
    <div className="recent-content__layout">
      {recentLists.length === 0
        ? <Empty image="/images/undraw_empty.svg"
          imageStyle={{ width: '200px' }} />
        : recentLists.map(n => {
          return (
            <Fragment key={n.id}>
              <RecentContent {...n}
                onRecentAction={onRecentAction} />
            </Fragment>
          );
        })
      }
    </div>
  );
}