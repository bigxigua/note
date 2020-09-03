import React, { useEffect, useState, useCallback, useContext } from 'react';
import Article from '@components/article';
import { M404 } from 'xigua-components/dist/js';
import ShareHeader from './share-header';
import MobileArticleToolbar from '@components/mobile-article-toolbar';
import axiosInstance from '@util/axiosInstance';
import articleContext from '@context/article/articleContext';
import ArticleState from '@context/article/articleState';
import { checkBrowser, getIn } from '@util/util';
import './index.css';

function Content({ error }) {
  if (error === undefined) {
    return null;
  }
  return error ? <M404 subTitle={error} /> : <Article share={true} />;
}

function Share() {
  const { updateStoreCurrentDoc } = useContext(articleContext);
  const [docInfo, setDocInfo] = useState(undefined);
  const [error, setError] = useState(undefined);
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const { isMobile } = checkBrowser();

  const fetchDocDetail = useCallback(async () => {
    const [error, data] = await axiosInstance.get(`doc/share?docId=${docId}`);
    if (error || !Array.isArray(data) || data.length === 0) {
      setError(getIn(error, ['message'], '页面链接错误或被删除'));
      return;
    }
    setError(false);
    setDocInfo(data[0]);
    updateStoreCurrentDoc(data[0]);
  }, [docId]);

  useEffect(() => {
    fetchDocDetail();
  }, [docId]);
  return (
    <div className="article">
      <ShareHeader docInfo={docInfo} />
      <Content error={error} />
      {isMobile && <MobileArticleToolbar html={(docInfo || {}).html} />}
    </div>
  );
}

export default function ArticlePage() {
  return (
    <ArticleState>
      <Share />
    </ArticleState>
  );
}