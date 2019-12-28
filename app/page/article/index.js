import React, { useEffect, useState, useCallback } from 'react';
import ArticleHeader from '@components/header-article';
import Header from '@components/header/header';
import Article from '@components/article';
import Mobile404 from '@common/m-404';
import axiosInstance from '@util/axiosInstance';
import './index.css';

function renderHeader(error, docInfo) {
  if (error === undefined) {
    return null;
  }
  return error ? <Header /> : <ArticleHeader docInfo={docInfo} />;
}

function renderContent(error, docInfo) {
  if (error === undefined) {
    return null;
  }
  return error ? <Mobile404 /> : <Article docInfo={docInfo} />;
}

export default function Index() {
  const [docInfo, setDocInfo] = useState(undefined);
  const [error, setError] = useState(undefined);
  const docId = window.location.pathname.split('/').filter(n => n)[1];

  const fetchDocDetail = useCallback(async () => {
    const [error, data] = await axiosInstance.get(`docs?docId=${docId}&type=detail`);
    if (error || !Array.isArray(data) || data.length === 0) {
      console.log('[获取文档信息失败]', error, data);
      setError(true);
      return;
    }
    setError(false);
    setDocInfo(data[0]);
  }, [docId]);

  useEffect(() => {
    fetchDocDetail();
  }, [docId]);

  return (
    <div className="Container">
      {renderHeader(error, docInfo)}
      <div className="Content_Wrapper">
        {renderContent(error, docInfo)}
      </div>
    </div>
  );
}