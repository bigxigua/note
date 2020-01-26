import React, { useState, useEffect, useCallback } from 'react';
import ArticleCatalog from '@components/article-catalog';
import BookCatalog from '@components/book-catalog';
import Footer from '@components/footer';
import MobileArticleToolbar from '@components/mobile-article-toolbar';
import FooterMeta from './footer-meta';
import DraftTips from './draft-tips';
import { parseUrlQuery, checkBrowser, getCatalogs, codeBeautiful } from '@util/util';
import Prism from '@public/prism/prism.js';
import '@public/prism/prism.css';
import './index.css';

const { isMobile } = checkBrowser();

// 获取标题
function getTitle(docInfo = {}, content) {
  const title = docInfo.title_draft || docInfo.title;
  return content === 'origin' ? docInfo.title : title;
}

// 获取html内容
function getHtml(docInfo = {}, content) {
  const html = docInfo.html_draft || docInfo.html;
  return content === 'origin' ? docInfo.html : html;
}

// bind scroll事件
function onScroll() {
  // console.log(e);
}

// 计算h标签的位置信息
function getTagHPosition(docInfo = {}, content) {
  const html = getCatalogs(getHtml(docInfo, content));
  // $('.article-preview').scrollTop()
  if (Array.isArray(html) && html.length > 0) {
    html.forEach((item) => {
      console.log($(`#${item.id}`)[0].getBoundingClientRect().top);
    });
  }
}

export default function Article({ docInfo }) {
  const [classes] = useState(`article-preview ${isMobile ? 'article-preview_mobile' : ''}`);
  const { content = 'draft' } = parseUrlQuery();

  useEffect(() => {
    const html = getHtml(docInfo, content);
    if (!html) return;
    $('.article-html').html(html);
    getTagHPosition(docInfo, content);
    setTimeout(() => {
      codeBeautiful(document.querySelectorAll('pre'), Prism);
    }, 0);
  }, [docInfo, content]);

  const title = getTitle(docInfo, content);
  const wrapperClasses = `article-html ${isMobile && 'article-html_mobile'}`;

  return (
    <div className="Article_Wrapper">
      {!isMobile && <BookCatalog />}
      <div
        className={classes}
        onScroll={onScroll}>

        <DraftTips docInfo={docInfo} />

        {title && <h1>{title}</h1>}

        <div className={$.trim(wrapperClasses)}></div>

        <FooterMeta docInfo={docInfo || {}} />

        {isMobile && <MobileArticleToolbar />}

        <Footer style={{ marginTop: '100px' }} />
      </div>
      <ArticleCatalog
        className="article_catalog"
        html={getHtml(docInfo, content)} />
    </div>
  );
};