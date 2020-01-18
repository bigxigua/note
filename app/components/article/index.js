import React, { useState, useEffect, useContext, useCallback } from 'react';
import ArticleCatalog from '@components/article-catalog';
import BookCatalog from '@components/book-catalog';
import Footer from '@components/footer';
import MobileArticleToolbar from '@components/mobile-article-toolbar';
// import editorContext from '@context/editor/editorContext';
import FooterMeta from './footer-meta';
import DraftTips from './draft-tips';
import { parseUrlQuery, checkBrowser } from '@util/util';
import './index.css';

const { isMobile } = checkBrowser();

// 获取标题
function getTitle(docInfo = {}, content) {
  let title = docInfo.title_draft || docInfo.title;
  if (content === 'origin') {
    title = docInfo.title;
  }
  return title;
}

export default function Article({ docInfo }) {
  const [classes, setClassess] = useState(`Article_Preview_Wrapper ${isMobile ? 'article_preview_wrapper_m' : ''}`);
  const { content = 'draft' } = parseUrlQuery();

  useEffect(() => {
    const { html, html_draft } = docInfo || {};
    $('.article_html').html(content === 'origin' ? html : html_draft || html);
  }, [docInfo, content]);

  const catalogsUpdate = useCallback((list) => {
    const str = !isMobile ? 'article_no_catalog' : '';
    if (list.length === 0) {
      setClassess(classes + ` ${str}`);
    } else {
      setClassess(classes.replace(/article_no_catalog/, ''));
    }
  }, [classes]);

  const title = getTitle(docInfo, content);

  return (
    <div className="Article_Wrapper">
      {!isMobile && <BookCatalog />}
      <div className={classes}>
        <DraftTips docInfo={docInfo} />
        {title && <h1>{title}</h1>}
        <div className="article_html"></div>
        <FooterMeta docInfo={docInfo || {}} />

        <Footer style={{ marginTop: '20px' }} />

        {isMobile && <MobileArticleToolbar />}
      </div>
      <ArticleCatalog catalogsUpdate={catalogsUpdate} />
    </div>
  );
};