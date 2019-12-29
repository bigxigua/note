import React, { useState, useEffect, useContext, useCallback } from 'react';
import ArticleCatalog from '@components/article-catalog';
import BookCatalog from '@components/book-catalog';
import Footer from '@components/footer';
import MobileArticleToolbar from '@components/mobile-article-toolbar';
import editorContext from '@context/editor/editorContext';
import FooterMeta from './footer-meta';
import DraftTips from './draft-tips';
import { parseUrlQuery, checkBrowser } from '@util/util';
import './index.css';

const { isMobile } = checkBrowser();

async function previewMarkdownToContainer({
  content,
  onLoad = console.log,
  docInfo: {
    markdown,
    markdown_draft
  }
}) {
  let md = markdown_draft || markdown;
  if (content === 'origin') {
    md = markdown;
  }
  $('.editormd').html('');
  // TODO
  // 文档作者，content表示显示草稿内容还是文档内容
  // 非文档作者忽略该参数，直接显示文档内容
  return window.editormd('editormd', {
    toolbar: false,
    height: 'auto',
    path: '/editor/lib/',
    previewTheme: 'mkfx',
    htmlDecode: 'style,script,iframe',
    readOnly: true,
    markdown: md,
    styleActiveLine: false,
    lineNumbers: false,
    watch: false,
    tex: true,
    emoji: true,
    tocm: false,
    taskList: true,
    flowChart: true,
    previewCodeHighlight: true,
    // sequenceDiagram: true,
    onload: function () {
      this.previewing();
      onLoad(this);
    }
  });
}

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
  const { updateEditorInfo } = useContext(editorContext);
  const { content = 'draft' } = parseUrlQuery();
  useEffect(() => {
    if (!docInfo) {
      return;
    }
    previewMarkdownToContainer({
      content,
      docInfo,
      onLoad: (d) => {
        updateEditorInfo(d);
      }
    });
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
        <article
          className={`${isMobile ? 'editormd_mobile' : ''}`}
          id="editormd" />
        <FooterMeta docInfo={docInfo || {}} />
        <Footer style={{ marginTop: '20px' }} />
        <MobileArticleToolbar />
      </div>
      <ArticleCatalog
        catalogsUpdate={catalogsUpdate}
        dynamic={true} />
    </div>
  );
};