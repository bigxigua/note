import React, { Fragment, useEffect, useState, useCallback } from 'react';
import RecentContent from '@components/recent-content';
import Empty from '@common/empty';
import Loading from '@common/loading';
import axiosInstance from '@util/axiosInstance';

export default function RecentContentLayout() {
  const [recentLists, setRecentLists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [error, data] = await axiosInstance.get('/recents?limit=20');
      setLoading(false);
      if (error || !Array.isArray(data)) {
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

  return (
    <div className="recent-content__layout">
      <Loading show={loading} />
      {recentLists.length === 0
        ? <Empty />
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