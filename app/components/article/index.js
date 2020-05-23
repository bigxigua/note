import React, { useState, useEffect } from 'react';
import Icon from '@common/icon';
import ArticleCatalog from '@components/article-catalog';
import SpaceCatalog from '@components/space-catalog';
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

  if (!Array.isArray(catalogs) || catalogs.length === 0) {
    return;
  }

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
    $('.article-catalog__item').removeClass('article-catalog__item-active');
    $(`.article-catalog__item-${curTarget}`).addClass('article-catalog__item-active');
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
      codeBeautiful(document.querySelectorAll('.article-html>pre'), Prism);
      scrollToElement();
      onScroll(html);
      $(window).trigger('scroll');
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