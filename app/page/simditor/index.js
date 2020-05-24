import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { simditorParams } from '@config/index';
import ArticleHeader from '@components/header-article';
import FloatButton from '@components/float-button';
import ArticleCatalog from '@components/article-catalog';
import editorContext from '@context/editor/editorContext';
import useSaveContent from '@hooks/use-save-content';
import Simditor from '@public/editor/simditor';
import '@public/editor/simditor-checklist';
import '@public/editor/simditor-markdown';
import '@public/editor/simditor-inline-code';
import '@public/editor/simditor-emoji';
import '@public/editor/simditor-html';
// https://github.com/mycolorway/simditor-livemd
import '@public/editor/simditor-livemd';
// import '@public/editor/simditor-mark';
import { parseUrlQuery, checkBrowser } from '@util/util';
import { listenContainerScrollToShowCurCatalog, scrollToElement } from '@util/commonFun2';
import {
  fetchDocDetail,
  getTileAndHtml,
  addUnloadListener,
  monitorKeyupHandle,
  insertTitleInputToSimditor
} from './handle';
import './index.css';

// 空函数
const loop = () => { };
const { isMobile } = checkBrowser();

export default function Page() {
  const { spaceId = '', content = '' } = parseUrlQuery();
  const [doc, updateDoc] = useState({});
  const [html, setHtml] = useState('');
  const { updateEditorInfo } = useContext(editorContext);
  const saveHandle = useSaveContent({ spaceId });
  const simditorInstance = useRef({});

  const renderSimditor = useCallback(async () => {
    const docInfo = await fetchDocDetail();
    const htmlText = getTileAndHtml(docInfo, content).content;
    updateDoc(docInfo);
    setHtml(htmlText);

    const simditor = new Simditor({
      ...simditorParams,
      textarea: $('#editor')
    });

    simditor.on('valuechanged', () => {
      const content = simditor.getValue();
      // 表示文档被修改。可以触发卸载时的保存草稿行为
      window.CONTENT_ALREADY_CHANGE = true;
      setHtml(content);
    });

    // 保存simditor实例到context
    updateEditorInfo(simditor);
    simditorInstance.current = simditor;

    // 插入标题dom
    insertTitleInputToSimditor(docInfo, content);

    // 监听标题输入框change设置内容到缓存
    $('.simditor-title>input').on('input', () => {
      simditor.trigger('valuechanged');
    });

    scrollToElement($('.simditor'));
    listenContainerScrollToShowCurCatalog({
      html: htmlText,
      $container: $('.simditor')
    });
    $('.simditor').trigger('scroll');

    // 页面卸载，保存草稿
    addUnloadListener(docInfo.doc_id, simditor);
  }, []);

  useEffect(() => {
    renderSimditor();
    monitorKeyupHandle({ save: saveHandle, simditor: simditorInstance });
  }, []);

  const classes = `${isMobile ? 'simditor-container_mobile' : 'simditor-container'}`;

  return (
    <div className="simditor-page">
      {
        !isMobile && <ArticleHeader
          className="simditor-header"
          docInfo={doc} />
      }
      <div className={classes}>
        <div className={`simditor-content ${isMobile ? 'simditor-content_mobile' : ''}`}>
          <textarea
            className="simditor_textarea"
            onChange={loop}
            value={html}
            id="editor" />
          <ArticleCatalog html={html} />
        </div>
      </div>
      {/* 移动端保存悬浮按钮 */}
      <FloatButton />
    </div>
  );
}