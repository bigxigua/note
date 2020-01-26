import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { simditorParams } from '@config/index';
import ArticleHeader from '@components/header-article';
import ArticleCatalog from '@components/article-catalog';
import editorContext from '@context/editor/editorContext';
import useSaveContent from '@hooks/use-save-content';
import Simditor from '@public/editor/simditor';
import '@public/editor/simditor-checklist';
import '@public/editor/simditor-markdown';
import '@public/editor/simditor-emoji';
import '@public/editor/simditor-html';
// https://github.com/mycolorway/simditor-livemd
import '@public/editor/simditor-livemd';
// import '@public/editor/simditor-mark';

import { parseUrlQuery, checkBrowser } from '@util/util';
import {
  fetchDocDetail,
  getTileAndHtml,
  setDraftToStorage,
  monitorKeyupHandle,
  onSimditorWrapperScroll,
  insertTitleInputToSimditor
} from './handle';
import './index.css';

// 空函数
const loop = () => { };
const { isMobile } = checkBrowser();

export default function Page() {
  const { spaceId = '' } = parseUrlQuery();
  const [doc, updateDoc] = useState({});
  const [html, setHtml] = useState('');
  const { updateEditorInfo } = useContext(editorContext);
  const saveHandle = useSaveContent({ spaceId });
  const simditorInstance = useRef({});

  const storageKey = `autosave${window.location.pathname}`;

  const renderSimditor = useCallback(async () => {
    const docInfo = await fetchDocDetail();

    updateDoc(docInfo);

    setHtml(getTileAndHtml(docInfo, storageKey).content);

    const simditor = new Simditor({
      ...simditorParams,
      textarea: $('#editor')
    });

    simditor.on('valuechanged', () => {
      const content = simditor.getValue();
      const title = $.trim($('.simditor-title>input').val());
      setHtml(content);
      // 保存内容到浏览器缓存
      setDraftToStorage(storageKey, 'content', content);
      setDraftToStorage(storageKey, 'title', title);
    });

    // 保存simditor实例到context
    updateEditorInfo(simditor);
    simditorInstance.current = simditor;

    // 插入标题
    insertTitleInputToSimditor(docInfo, storageKey);

    // 监听标题输入框change设置内容到缓存
    $('.simditor-title>input').on('input', () => {
      simditor.trigger('valuechanged');
    });

    onSimditorWrapperScroll();

    // 启动定时更新草稿定时器(20s自动保存数据到服务端)
    // TODO 最好的做法应该是在停止输入后几秒开启定时刷新定时器。
    // const timer = setInterval(() => {
    //   // 若无缓存则表示无变动。无需上报
    //   try {
    //     if (isObject(JSON.parse(window.localStorage.getItem(storageKey)))) {
    //       saveHandle(simditorInstance.current);
    //       window.localStorage.setItem(storageKey, null);
    //     }
    //   } catch (error) {
    //     console.log('error', error);
    //   }
    // }, 5000);
  }, []);

  useEffect(() => {
    renderSimditor();
    monitorKeyupHandle({ save: saveHandle, simditor: simditorInstance });
    // TODO bind scrollwrapper scroll event add shadow
  }, []);

  const classes = `${isMobile ? 'simditor-container_mobile' : 'simditor-container'}`;

  return (
    <div className="simditor-page">
      {
        !isMobile
          ? <ArticleHeader
            className="simditor-header"
            docInfo={doc} />
          : null
      }
      <div className={classes}>
        <div className={`simditor-content ${isMobile ? 'simditor-content_mobile' : ''}`}>
          <textarea
            className="simditor_textarea"
            value={html}
            onChange={loop}
            id="editor" />
          <ArticleCatalog html={html} />
        </div>
      </div>
      {/* 移动端保存悬浮按钮 */}
    </div>
  );
}