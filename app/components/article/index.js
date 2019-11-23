import React, { useEffect, useContext } from 'react';
import ArticleCatalog from '@components/article-catalog';
import BookCatalog from '@components/book-catalog';
import Footer from '@components/footer';
import editorContext from '@context/editor/editorContext';
import FooterMeta from './footer-meta';
import DraftTips from './draft-tips';
import { parseUrlQuery } from '@util/util';
import './index.css';

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
    height: 'auto',
    path: '/editor/lib/',
    readOnly: true,
    markdown: md,
    styleActiveLine: false,
    lineNumbers: false,
    toolbar: false,
    watch: false,
    previewCodeHighlight: true,
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
  return (
    <div className="Article_Wrapper">
      <BookCatalog />
      <div className="Article_Preview_Wrapper">
        <DraftTips docInfo={docInfo} />
        <h1>{getTitle(docInfo, content)}</h1>
        <article id="editormd"></article>
        <FooterMeta docInfo={docInfo || {}} />
        <Footer style={{ marginTop: '40px' }} />
      </div>
      <ArticleCatalog dynamic={true} />
    </div>
  );
};