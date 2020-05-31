import React, { useEffect, useState, useCallback } from 'react';
import ArticleHeader from '@components/header-article';
import Header from '@components/header/header';
import Article from '@components/article';
import Mobile404 from '@common/m-404';
import axiosInstance from '@util/axiosInstance';
import MobileArticleToolbar from '@components/mobile-article-toolbar';
import { checkBrowser, parseUrlQuery, getIn } from '@util/util';
import './index.css';

const { isMobile } = checkBrowser();

function MainHeader({ error, docInfo }) {
  if (error === undefined) {
    return null;
  }
  return error ? <Header /> : <ArticleHeader docInfo={docInfo} />;
}

function Content({ error, docInfo }) {
  if (error === undefined) {
    return null;
  }
  return error ? <Mobile404 /> : <Article docInfo={docInfo} />;
}

export default function Page() {
  // 当前文档信息
  const [docInfo, setDocInfo] = useState(undefined);
  // 正在获取空间下的文档列表
  const [isLoading, setLoading] = useState({});
  const [error, setError] = useState(undefined);
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const { spaceId } = parseUrlQuery();

  const fetchDocDetail = useCallback(async () => {
    setLoading(true);
    const [error, data] = await axiosInstance.get(`space/docs?space_id=${spaceId}`);
    setLoading(false);
    const docs = getIn(data, ['docs'], []);
    const curDocInfo = docs.find(n => n.doc_id === docId);
    if (error || !curDocInfo) {
      setError(true);
      return;
    }
    setError(false);
    setDocInfo(curDocInfo);
  }, [docId]);

  useEffect(() => {
    fetchDocDetail();
  }, [docId]);

  return (
    <div className="article">
      <MainHeader error={error}
        docInfo={docInfo} />
      <Content error={error}
        docInfo={docInfo} />
      {isMobile && <MobileArticleToolbar html={(docInfo || {}).html} />}
    </div>
  );
}