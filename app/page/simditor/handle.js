import { getIn, checkBrowser, addKeydownListener } from '@util/util';
import axiosInstance from '@util/axiosInstance';
import { DOMAIN } from '@util/config';

const { isMobile } = checkBrowser();

// 获取文档信息
export async function fetchDocDetail() {
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const [, data] = await axiosInstance.get(`docs?type=detail&docId=${docId}`);
  return getIn(data, [0], {}) || {};
}

// 插入标题编辑input
export function insertTitleInputToSimditor(doc, content) {
  const simditorBody = document.querySelector('.simditor-body');
  const title = getTileAndHtml(doc, content).title || '';
  const titleDom =
    `<div class="simditor-title${isMobile ? ' simditor-title_mobile' : ''}">` +
    `<input maxlength="30" placeholder="无标题" value='${title.substr(0, 30)}' />` +
    '</div>';
  if (simditorBody) {
    $(titleDom).insertBefore($($('.simditor-wrapper').children()[0]));
  }
}

// 监听键盘事件，设置快捷键操作
export function monitorKeyupHandle({ save, simditor }) {
  if (isMobile) return;
  return addKeydownListener({
    handle: ({ keyCode, ctrlKey, e }) => {
      if (ctrlKey && keyCode === 83) {
        e.preventDefault();
        save(simditor.current);
      }
    }
  });
}

/**
* 监听onunload事件，页面卸载时如果内容发生更改，自动保存草稿
* @param {string} docId - 文档id
* @param {object} simditor - simditor编辑器实例
*/
export function addUnloadListener(docId, simditor) {
  window.addEventListener('unload', () => {
    // 如果点了更新或文档未进行编辑就不再sendBeacon保存草稿
    if (!window.IS_UPDATED_UNLOAD && window.CONTENT_ALREADY_CHANGE) {
      const formData = new FormData();
      formData.append('doc_id', docId);
      formData.append('html_draft', simditor.getValue());
      formData.append('title_draft', $.trim($('.simditor-title>input').val()));
      window.navigator.sendBeacon(`${DOMAIN}doc/update`, formData);
    }
  }, false);
}

/**
* 根据query的content参数来决定，当前显示的是草稿还是正式内容
* content默认值为origin(正式内容)，draft(草稿内容)
* @param {objecr} info - 文档信息
* @param {string} type - 显示草稿还是正式内容
* @return {object} { title: 标题， content: 文档内容 }
*/
export function getTileAndHtml(info, type) {
  type = type || 'origin';
  const title = type === 'origin' ? info.title : info.title_draft || info.title;
  const content = type === 'origin' ? info.html : info.html_draft || info.html;
  return {
    title,
    content
  };
}

// 更新编辑草稿到浏览器缓存
export function setDraftToStorage(storageKey, key, value) {
  const storage = JSON.parse(window.localStorage.getItem(storageKey) || '{}');
  window.localStorage.setItem(storageKey, JSON.stringify({
    ...storage,
    [`${key}`]: value
  }));
}

// 监听scroll事件
export function onSimditorWrapperScroll() {
}