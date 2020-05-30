import React, { useState, useEffect } from 'react';
import { PhotoSwipe } from 'react-photoswipe';
import Icon from '@common/icon';
import ArticleCatalog from '@components/article-catalog';
import SpaceCatalog from '@components/space-catalog';
import Footer from '@components/footer';
import FooterMeta from './footer-meta';
import DraftTips from './draft-tips';
import { parseUrlQuery, checkBrowser } from '@util/util';
import { listenContainerScrollToShowCurCatalog, scrollToElement } from '@util/commonFun2';
import { codeBeautiful, getImgsFromHtml } from './handle';
import Prism from '@public/prism/prism.js';
import './index.css';
import '@public/prism/prism.css';

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
  // 是否展示PhotoSwipe
  const [psIndex, setShowPsIndex] = useState(-1);
  // PhotoSwipe图片集合
  const [psImgs, setPsImgs] = useState([]);
  const { content = 'draft' } = parseUrlQuery();

  const classes = $.trim(`article-preview ${isMobile ? 'article-preview_mobile' : ''}`);
  useEffect(() => {
    const html = getHtml(docInfo, content);
    const $html = $('.article-html');
    $html.html(String(html));
    setTimeout(() => {
      // 给table包裹一层div
      $html.find('table').wrap($('<div class="article-html__tablebox"></div>'));
      // 给img新增（非icon）新增点击预览函数
      getImgsFromHtml($html, setPsImgs, setShowPsIndex);
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
  const psOtions = {
    index: psIndex,
    showHideOpacity: true,
    shareEl: false,
    zoomEl: true,
    preloaderEl: true,
    counterEl: true,
    mainClass: 'xigua-ps'
  };
  return (
    <div className="article-wrapper">
      <SpaceCatalog />
      <div
        className={$.trim(classes)}>

        {!share && <DraftTips docInfo={docInfo} />}

        <h1 className={titleClasses}>{title || '未设置标题'}</h1>

        <article className={wrapperClasses}></article>

        <FooterMeta docInfo={docInfo || {}} />

        <Footer />
      </div>
      {
        Boolean(psImgs.length) && <PhotoSwipe
          isOpen={Boolean(psIndex > -1)}
          items={psImgs.slice(0)}
          options={psOtions}
          onClose={() => { setShowPsIndex(-1); }} />
      }
      <ArticleCatalog
        className="article_catalog"
        html={getHtml(docInfo, content)} />
    </div>
  );
};