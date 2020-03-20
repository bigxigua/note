import React, { useEffect, useState, useCallback } from 'react';
import ArticleHeader from '@components/header-article';
import Header from '@components/header/header';
import Article from '@components/article';
import Mobile404 from '@common/m-404';
import axiosInstance from '@util/axiosInstance';
import MobileArticleToolbar from '@components/mobile-article-toolbar';
import { checkBrowser } from '@util/util';
import './index.css';

const { isMobile } = checkBrowser();

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
  // 当前文档信息
  const [docInfo, setDocInfo] = useState(undefined);
  const [error, setError] = useState(undefined);
  const docId = window.location.pathname.split('/').filter(n => n)[1];

  const fetchDocDetail = useCallback(async () => {
    const [error, data] = await axiosInstance.get(`docs?docId=${docId}&type=detail`);
    if (error || !Array.isArray(data) || data.length === 0) {
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
    <div className="article">
      {renderHeader(error, docInfo)}
      {renderContent(error, docInfo)}
      {isMobile && <MobileArticleToolbar html={(docInfo || {}).html} />}
    </div>
  );
}