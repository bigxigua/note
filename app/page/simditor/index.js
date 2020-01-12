import React, { useEffect, useState, useContext, useCallback } from 'react';
import { simditorParams } from '@config/index';
import ArticleHeader from '@components/header-article';
import axiosInstance from '@util/axiosInstance';
import editorContext from '@context/editor/editorContext';
import { getIn, checkBrowser, parseUrlQuery } from '@util/util';
import 'simple-module';
import 'simple-hotkeys';
import 'simple-uploader';
import Simditor from 'simditor';
import 'simditor/styles/simditor.css';
import './index.css';

// 检测浏览器为移动端
const { isMobile } = checkBrowser();

// 获取文档数据
async function fetchDocDetail() {
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const [, data] = await axiosInstance.get(`docs?type=detail&docId=${docId}`);
  return getIn(data, [0], {}) || {};
};

// 获取标题
function getTitle(docInfo = {}, content) {
  const title = docInfo.title_draft || docInfo.title;
  return content === 'origin' ? docInfo.title : title;
}

// 往simditor body内插入标题input
function insertTitleInput(doc, content) {
  const simditorBody = document.querySelector('.simditor-body');
  const title = getTitle(doc, content);
  const titleDom =
    `<div class="CodeMirror_title ${isMobile ? 'codemirror_title_mobile' : ''} flex">` +
    `<input maxlength="30" value='${title.substr(0, 30)}' />` +
    '</div>';
  if (simditorBody) {
    $(titleDom).insertBefore($($('.simditor-body').children()[0]));
  }
}

export default function Page() {
  const [doc, updateDoc] = useState({});
  const { updateEditorInfo } = useContext(editorContext);
  const { content = 'draft', spaceId = '' } = parseUrlQuery();

  const renderSimditor = useCallback(async () => {
    const info = await fetchDocDetail();
    updateDoc(info);
    const simditor = new Simditor({
      ...simditorParams,
      textarea: $('#editor')
    });
    // simditor.on('valuechanged', () => {
    //   console.log(simditor.getValue());
    // });
    // 保存simditor实例到context
    updateEditorInfo(simditor);
    // 插入标题
    insertTitleInput(info, content);
  }, []);

  useEffect(() => {
    renderSimditor();
  }, []);

  return (
    <div className="simditor_page">
      <ArticleHeader
        className="simditor_header"
        docInfo={doc} />
      <input
        type="text"
        className="simditor_title" />
      <textarea
        value={doc.html}
        onChange={() => { }}
        id="editor" />
    </div>
  );
}