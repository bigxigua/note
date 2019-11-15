import React, { useState, useEffect } from 'react';
import ArticleCatalog from '../article-catalog/index.js';
import BookCatalog from '../book-catalog/index.js';
// import userContext from '../../context/user/userContext.js';
import FooterMeta from './footer-meta';
import { INTRODUCE_MARKDOWN } from '../../config/index';
import './index.css';

function previewMarkdownToContainer(onload = console.log) {
  const editor = window.editormd('editormd', {
    height: 'auto',
    path: '/editor/lib/',
    readOnly: true,
    markdown: INTRODUCE_MARKDOWN,
    styleActiveLine: false,
    lineNumbers: false,
    toolbar: false,
    previewCodeHighlight: true,
    onload: () => {
      editor.previewing();
      onload(editor);
    }
  });
  return editor;
}
export default function Article() {
  // const { userInfo } = useContext(userContext);
  const [editormd, setEditor] = useState(null);
  useEffect(() => {
    previewMarkdownToContainer((d) => {
      setEditor(d);
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
        <article id="editormd"></article>
        <FooterMeta />
      </div>
      <ArticleCatalog editormd={editormd} />
    </div>
  );
};