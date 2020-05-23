import React, { useEffect, useState, useCallback } from 'react';
import Article from '@components/article';
import Mobile404 from '@common/m-404';
import ShareHeader from './share-header';
import axiosInstance from '@util/axiosInstance';
import { checkBrowser, getIn } from '@util/util';
import './index.css';

const { isMobile } = checkBrowser();

function Content({ error, docInfo }) {
  if (error === undefined) {
    return null;
  }
  return error ? <Mobile404 subTitle={error} /> : <Article share={true}
    docInfo={docInfo} />;
}

export default function Share() {
  // 当前文档信息
  const [docInfo, setDocInfo] = useState(undefined);
  const [error, setError] = useState(undefined);
  const docId = window.location.pathname.split('/').filter(n => n)[1];

  const fetchDocDetail = useCallback(async () => {
    const [error, data] = await axiosInstance.get(`doc/share?docId=${docId}`);
    if (error || !Array.isArray(data) || data.length === 0) {
      setError(getIn(error, ['message'], '页面链接错误或被删除'));
      return;
    }
    setError(false);
    setDocInfo(data[0]);
  }, [docId]);

  useEffect(() => {
    fetchDocDetail();
  }, [docId]);

  return (
    <div className="article">
      <ShareHeader docInfo={docInfo} />
      <Content error={error}
        docInfo={docInfo} />
    </div>
  );
}