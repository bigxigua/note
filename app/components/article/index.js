import React, { useState, useEffect, useContext } from 'react';
import ArticleCatalog from '@components/article-catalog';
import BookCatalog from '@components/book-catalog';
import Footer from '@components/footer';
import editorContext from '@context/editor/editorContext';
import FooterMeta from './footer-meta';

import './index.css';

async function previewMarkdownToContainer({
  onLoad = console.log,
  docInfo
}) {
  $('.editormd').html('');
  const editor = window.editormd('editormd', {
    height: 'auto',
    path: '/editor/lib/',
    readOnly: true,
    markdown: docInfo.markdown,
    styleActiveLine: false,
    lineNumbers: false,
    toolbar: false,
    previewCodeHighlight: true,
    onload: () => {
      editor.previewing();
      onLoad(editor);
    }
  });
  return editor;
}
export default function Article({ docInfo }) {
  const { updateEditorInfo } = useContext(editorContext);
  useEffect(() => {
    if (!docInfo) {
      return;
    }
    previewMarkdownToContainer({
      docInfo,
      onLoad: (d) => {
        updateEditorInfo(d);
        // let top = $('#editormd').offset().top;
        // $('.Article_Preview_Wrapper')[0].addEventListener('scroll', () => {
        //   const curTop = $('#editormd').offset().top;
        //   if (curTop - top < -160) {
        //     $('.Article_Header_Wrapper').addClass('Article_Header_Wrapper_Hide');
        //     $('.Article_Preview_Wrapper').css({ height: '100vh' });
        //     top = curTop;
        //   }
        //   if (curTop - top > 20) {
        //     $('.Article_Header_Wrapper').removeClass('Article_Header_Wrapper_Hide');
        //     $('.Article_Preview_Wrapper').css({ height: 'calc(100vh - 58px)' });
        //     top = curTop;
        //   }
        // }, false);
      }
    });
  }, [docInfo]);
  return (
    <div className="Article_Wrapper">
      <BookCatalog />
      <div className="Article_Preview_Wrapper">
        <h1>{(docInfo || {}).title}</h1>
        <article id="editormd"></article>
        <FooterMeta docInfo={docInfo || {}} />
        <Footer style={{ marginTop: '40px' }} />
      </div>
      <ArticleCatalog dynamic={true} />
    </div>
  );
};