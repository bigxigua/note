import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { simditorParams } from '@config/index';
import ArticleHeader from '@components/header-article';
import ArticleCatalog from '@components/article-catalog';
import editorContext from '@context/editor/editorContext';
import useSaveContent from '@hooks/use-save-content';
import { parseUrlQuery } from '@util/util';
import { monitorKeyupHandle, fetchDocDetail, insertTitleInputToSimditor } from './handle';
import './index.css';

// 空函数
const loop = () => { };

export default function Page() {
  const { content = 'draft', spaceId = '' } = parseUrlQuery();
  const [doc, updateDoc] = useState({});
  const [html, setHtml] = useState('');
  const { updateEditorInfo } = useContext(editorContext);
  const saveHandle = useSaveContent({ spaceId });
  const simditorInstance = useRef({});

  const renderSimditor = useCallback(async () => {
    const info = await fetchDocDetail();
    updateDoc(info);
    setHtml(info.html_draft || info.html);

    const simditor = new window.Simditor({
      ...simditorParams,
      textarea: $('#editor')
    });

    simditor.on('valuechanged', () => {
      setHtml(simditor.getValue());
      // 保存到window.localStorage
    });

    // 保存simditor实例到context
    updateEditorInfo(simditor);
    simditorInstance.current = simditor;
    // 插入标题
    insertTitleInputToSimditor(info, content);
  }, []);

  useEffect(() => {
    renderSimditor();
    monitorKeyupHandle({ save: saveHandle, simditor: simditorInstance });
  }, []);

  return (
    <div className="simditor_page">
      <ArticleHeader
        className="simditor_header"
        docInfo={doc} />
      <div className="simditor_content">
        <textarea
          className="simditor_textarea"
          value={doc.html_draft || doc.html}
          onChange={loop}
          id="editor" />
        <ArticleCatalog html={html} />
      </div>
    </div>
  );
}