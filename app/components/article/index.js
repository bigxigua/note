import React, { useState, useEffect } from 'react';
import ArticleCatalog from '@components/article-catalog';
import BookCatalog from '@components/book-catalog';
import Footer from '@components/footer';
import FooterMeta from './footer-meta';
import DraftTips from './draft-tips';
import { parseUrlQuery, checkBrowser, getCatalogs, debunce } from '@util/util';
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

// bind scroll事件
function onScroll(html) {
  const catalogs = getCatalogs(html);
  let windowScrollTop = $(window).scrollTop();
  let position = 'up';

  const handle = debunce(() => {
    let curTarget = null;
    const arr = [];
    for (let i = 0, len = catalogs.length; i < len; i++) {
      const id = catalogs[i].id;
      if (!id || !$(`#${id}`).length) return;
      const offsetTop = $(`#${id}`).offset().top - $(document).scrollTop() - 58;
      const curWindowScrollTop = $(window).scrollTop();
      if (curWindowScrollTop - windowScrollTop > 0) {
        position = 'up';
      } else if (curWindowScrollTop - windowScrollTop < 0) {
        position = 'down';
      }
      arr.push({ top: offsetTop, id });
      windowScrollTop = curWindowScrollTop;
    };

    if (!arr.length) return;

    if (position === 'up') {
      if (arr.every(n => n.top > 0)) {
        curTarget = arr[0].id;
      } else {
        curTarget = (arr.filter(n => n.top >= 0)[0] || arr.slice(0).pop()).id;
      }
    } else {
      if (arr.every(n => n.top < 0)) {
        curTarget = arr[arr.length - 1].id;
      } else {
        curTarget = arr.filter(n => n.top >= 0)[0].id;
      }
    }
    $('.catalog-item').removeClass('catalog-item__active');
    $(`.catalog-item_${curTarget}`).addClass('catalog-item__active');
  }, 100);
  $(window).off('scroll');
  $(window).on('scroll', handle);
}

// 获取url-hash，滚动到对应元素位置
function scrollToElement() {
  const id = window.location.hash.split('#')[1] || '';
  if (!id || $(`#${id}`).length === 0) {
    $('html, body').scrollTop(0);
    return;
  };
  $('html, body').animate({
    scrollTop: $(`#${id}`).offset().top - 58
  }, 400);
}

export default function Article({ docInfo = {} }) {
  const [classes] = useState(`article-preview ${isMobile ? 'article-preview_mobile' : ''}`);
  const { content = 'draft' } = parseUrlQuery();

  useEffect(() => {
    const html = getHtml(docInfo, content);
    $('.article-html').html(String(html));
    setTimeout(() => {
      codeBeautiful(document.querySelectorAll('.article-html>pre'), Prism);
      scrollToElement();
      onScroll(html);
    }, 0);
  }, [docInfo.doc_id, content]);

  const title = getTitle(docInfo, content);
  const wrapperClasses = `article-html ${isMobile ? 'article-html_mobile' : ''}`;

  return (
    <div className="article-wrapper">
      {!isMobile && <BookCatalog />}
      <div
        className={$.trim(classes)}>

        <DraftTips docInfo={docInfo} />

        {title && <h1>{title}</h1>}

        <article className={$.trim(wrapperClasses)}></article>

        <FooterMeta docInfo={docInfo || {}} />

        <Footer />
      </div>
      <ArticleCatalog
        className="article_catalog"
        html={getHtml(docInfo, content)} />
    </div>
  );
};