import React, { useEffect, useCallback } from 'react';
import ArticleHeader from '@components/header-article';
import Header from '@components/header/header';
import Icon from '@common/icon';
import Article from '@components/article';
import Mobile404 from '@common/m-404';
import axiosInstance from '@util/axiosInstance';
import MobileArticleToolbar from '@components/mobile-article-toolbar';
import { checkBrowser, parseUrlQuery, getIn } from '@util/util';
import { useImmer } from 'use-immer';
import './index.css';

const { isMobile } = checkBrowser();

function MainHeader({ state }) {
  const { error, docInfo, spaceInfo, isLoading } = state;
  if (isLoading) {
    return <div className="article-header__loading"><Icon type="loading" /></div>;
  }
  return error ? <Header /> : <ArticleHeader isLoading={isLoading}
    spaceInfo={spaceInfo}
    docInfo={docInfo} />;
}

function Content({ state }) {
  const { error, docInfo, spaceInfo, isLoading, docs } = state;
  return error ? <Mobile404 /> : <Article isLoading={isLoading}
    spaceInfo={spaceInfo}
    docs={docs}
    docInfo={docInfo} />;
}

export default function Page() {
  const [state, setState] = useImmer({
    isLoading: false, // 正在获取空间下的文档列表
    error: undefined, // 页面加载是否出错
    spaceInfo: {}, // 当前文档的空间信息
    docInfo: {}, // 当前文档信息
    docs: [] // 当前空间下的所有文档列表
  });
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const { spaceId } = parseUrlQuery();

  const fetchDocDetail = useCallback(async () => {
    setState(draft => {
      draft.isLoading = true;
    });
    const [error, data] = await axiosInstance.get(`space/docs?space_id=${spaceId}`);
    setState(draft => {
      draft.isLoading = false;
    });
    const docs = getIn(data, ['docs'], []);
    const space = getIn(data, ['space'], {});
    const curDocInfo = docs.find(n => n.doc_id === docId);
    if (error || !curDocInfo) {
      setState(draft => {
        draft.error = true;
      });
      return;
    }
    document.title = `${curDocInfo.title || '文档'} - 西瓜文档`;
    setState(draft => {
      draft.error = false;
      draft.docInfo = curDocInfo;
      draft.spaceInfo = space;
      draft.docs = docs;
    });
  }, [docId]);

  useEffect(() => {
    fetchDocDetail();
  }, [docId, spaceId]);

  return (
    <div className="article">
      <MainHeader state={state} />
      <Content state={state} />
      {isMobile && <MobileArticleToolbar html={state.docInfo.html} />}
    </div>
  );
}