import React, { useState, useEffect, useContext } from 'react';
import ArticleCatalog from '@components/article-catalog';
import BookCatalog from '@components/book-catalog';
import editorContext from '@context/editor/editorContext';
import FooterMeta from './footer-meta';
import axiosInstance from '@util/axiosInstance';
import { getIn } from '@util/util';
import './index.css';

async function previewMarkdownToContainer(onload = console.log) {
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const [error, data] = await axiosInstance.get(`doc/detail?doc_id=${docId}`);
  // TODO 区分当前文档的作者，如果是作者本人显示草稿内容，非本人显示真实文本
  const markdown = getIn(data, ['markdown'], '');
  if (!getIn(data, ['doc_id'])) {
    // TODO 报错如何处理
    console.log('[获取文档信息失败]', error, data);
    return;
  }
  const editor = window.editormd('editormd', {
    height: 'auto',
    path: '/editor/lib/',
    readOnly: true,
    markdown,
    styleActiveLine: false,
    lineNumbers: false,
    toolbar: false,
    previewCodeHighlight: true,
    onload: () => {
      editor.previewing();
      onload(editor, data);
    }
  });
  return editor;
}
export default function Article() {
  const [docInfo, setDocInfo] = useState({});
  const { updateEditorInfo } = useContext(editorContext);
  useEffect(() => {
    previewMarkdownToContainer((d, info) => {
      updateEditorInfo(d);
      setDocInfo(info);
      let top = $('#editormd').offset().top;
      $('.Article_Preview_Wrapper')[0].addEventListener('scroll', () => {
        const curTop = $('#editormd').offset().top;
        if (curTop - top < -160) {
          $('.Article_Header_Wrapper').addClass('Article_Header_Wrapper_Hide');
          $('.Article_Preview_Wrapper').css({ height: '100vh' });
          top = curTop;
        }
        if (curTop - top > 20) {
          $('.Article_Header_Wrapper').removeClass('Article_Header_Wrapper_Hide');
          $('.Article_Preview_Wrapper').css({ height: 'calc(100vh - 58px)' });
          top = curTop;
        }
      }, false);
    });
  }, []);
  return (
    <div className="Article_Wrapper">
      <BookCatalog />
      <div className="Article_Preview_Wrapper">
        <h1>{docInfo.title}</h1>
        <article id="editormd"></article>
        <FooterMeta />
      </div>
      <ArticleCatalog />
    </div>
  );
};