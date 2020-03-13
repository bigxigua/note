import { getIn, checkBrowser, addKeydownListener, isObject } from '@util/util';
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
export function insertTitleInputToSimditor(doc, storageKey) {
  const simditorBody = document.querySelector('.simditor-body');
  const title = getTileAndHtml(doc, storageKey).title || '';
  const titleDom =
    `<div class="simditor-title ${isMobile ? 'simditor-title_mobile' : ''}">` +
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

// 监听onunload事件，自动保存数据
export function addUnloadListener(docId, simditor, storageKey) {
  window.addEventListener('unload', () => {
    const formData = new FormData();
    formData.append('doc_id', docId);
    formData.append('html_draft', simditor.getValue());
    formData.append('title_draft', $.trim($('.simditor-title>input').val()));
    window.navigator.sendBeacon(`${DOMAIN}doc/update`, formData);
    window.localStorage.setItem(storageKey, '');
  }, false);
}

// 获取content和title
export function getTileAndHtml(info, key) {
  // const draftCached = JSON.parse(window.localStorage.getItem(key));
  const draftCached = undefined;
  const title = info.title_draft || info.title;
  const content = info.html_draft || info.html;
  console.log('draftCached:', draftCached);
  if (isObject(draftCached)) {
    return {
      title: draftCached.title || '',
      content: draftCached.content || ''
    };
  } else {
    return {
      title,
      content
    };
  }
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