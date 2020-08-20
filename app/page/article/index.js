import React, { useEffect, useCallback, useContext } from 'react';
import ArticleHeader from '@components/header-article';
import Header from '@components/header/header';
import Article from '@components/article';
import { Icon, M404 } from 'xigua-components/dist/js';
import axiosInstance from '@util/axiosInstance';
import MobileArticleToolbar from '@components/mobile-article-toolbar';
import ArticleState from '@context/article/articleState';
import articleContext from '@context/article/articleContext';
import { checkBrowser, parseUrlQuery, getIn } from '@util/util';
import { useImmer } from 'use-immer';
import './index.css';

const { isMobile } = checkBrowser();

function MainHeader({ state, spaceInfo, docInfo }) {
  const { error, isLoading } = state;
  if (isLoading) {
    return <div className="article-header__loading"><Icon type="loading" /></div>;
  }
  return error ? <Header /> : <ArticleHeader isLoading={isLoading}
    spaceInfo={spaceInfo}
    docInfo={docInfo} />;
}

function Content({ state }) {
  const { error, isLoading } = state;
  return error ? <M404 /> : <Article isLoading={isLoading} />;
}

function Page() {
  const [state, setState] = useImmer({
    isLoading: false, // 正在获取空间下的文档列表
    error: undefined, // 页面加载是否出错
  });
  const {
    space,
    currentDocInfo,
    updateStoreCurrentDoc,
    updateStoreDocs,
    updateStoreSpace
  } = useContext(articleContext);
  // 获取空间和该空间下的所有文档信息
  const fetchDocDetail = useCallback(async () => {
    const docId = window.location.pathname.split('/').filter(n => n)[1];
    const { spaceId } = parseUrlQuery();
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
    // 更新文档相关信息到articleContext
    updateStoreCurrentDoc(curDocInfo);
    updateStoreDocs(docs);
    updateStoreSpace(space);
    // 设置页面标题
    document.title = `${curDocInfo.title || '文档'} - 西瓜文档`;
    setState(draft => {
      draft.error = false;
    });
  }, []);

  useEffect(() => {
    fetchDocDetail();
  }, []);

  return (
    <div className="article">
      <MainHeader state={state} docInfo={currentDocInfo} spaceInfo={space} />
      <Content state={state} />
      {isMobile && <MobileArticleToolbar html={state.docInfo.html} />}
    </div>
  );
}

export default function ArticlePage() {
  return (
    <ArticleState>
      <Page />
    </ArticleState>
  )
}