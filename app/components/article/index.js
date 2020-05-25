import React, { useState, useEffect } from 'react';
import Icon from '@common/icon';
import ArticleCatalog from '@components/article-catalog';
import SpaceCatalog from '@components/space-catalog';
import Footer from '@components/footer';
import FooterMeta from './footer-meta';
import DraftTips from './draft-tips';
import { parseUrlQuery, checkBrowser } from '@util/util';
import { listenContainerScrollToShowCurCatalog, scrollToElement } from '@util/commonFun2';
import { codeBeautiful } from './handle';
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

// docInfo 文档信息
// share 是否是分享页面
export default function Article({ docInfo = {}, share = false }) {
  if (!docInfo || !docInfo.doc_id) {
    return <Icon type="loading" />;
  }
  const [classes] = useState(`article-preview ${isMobile ? 'article-preview_mobile' : ''}`);
  const { content = 'draft' } = parseUrlQuery();

  useEffect(() => {
    const html = getHtml(docInfo, content);
    $('.article-html').html(String(html));
    setTimeout(() => {
      // 给table包裹一层div
      $('.article-html').find('table').wrap($('<div class="article-html__tablebox"></div>'));
      codeBeautiful(document.querySelectorAll('.article-html>pre'), Prism);
      if (!isMobile) {
        scrollToElement($('html, body'));
        listenContainerScrollToShowCurCatalog({
          html,
          $container: $(window)
        });
        $(window).trigger('scroll');
      }
    }, 0);
  }, [docInfo.doc_id, content]);

  const title = getTitle(docInfo, content);
  const wrapperClasses = $.trim(`article-html ${isMobile ? 'article-html_mobile' : ''}`);
  const titleClasses = title ? '' : 'article-title';

  return (
    <div className="article-wrapper">
      {!share && <SpaceCatalog />}
      <div
        className={$.trim(classes)}>

        {!share && <DraftTips docInfo={docInfo} />}

        <h1 className={titleClasses}>{title || '未设置标题'}</h1>

        <article className={wrapperClasses}></article>

        <FooterMeta docInfo={docInfo || {}} />

        <Footer />
      </div>
      <ArticleCatalog
        className="article_catalog"
        html={getHtml(docInfo, content)} />
    </div>
  );
};