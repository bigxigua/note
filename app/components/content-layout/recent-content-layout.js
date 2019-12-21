import React, { Fragment, useEffect, useState, useCallback } from 'react';
import RecentContent from '@components/recent-content';
import Empty from '@common/empty';
import Icon from '@common/icon';
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

  if (loading) {
    return <div className="recent_loading">
      <Icon type="loading" />
      <span>正在加载...</span>
    </div>;
  }

  if (recentLists.length === 0) {
    return <Empty />;
  }

  return (
    <div className="Recent_Content_Layout">
      {
        recentLists.map(n => {
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