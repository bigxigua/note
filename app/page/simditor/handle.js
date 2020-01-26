import { getIn, checkBrowser, addKeydownListener, isObject } from '@util/util';
import axiosInstance from '@util/axiosInstance';

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
export function addUnloadListener() {
  window.addEventListener('unload', () => {
    // 保存草稿数据到localStorage
    // fetchApi({
    //   url: '/doc/update',
    //   method: 'POST',
    //   keepalive: true,
    //   body: {
    //     doc_id: docId,
    //     html_draft: '',
    //     title_draft: ''
    //   }
    // }).catch((error) => {
    //   console.log('------', error);
    // });
  }, false);
}

// 获取content和title
export function getTileAndHtml(info, key) {
  const draftCached = JSON.parse(window.localStorage.getItem(key));
  const title = info.title_draft || info.title;
  const content = info.html_draft || info.html;
  if (isObject(draftCached)) {
    return {
      title: draftCached.title || '',
      content: draftCached.content || ''
    };
  } else {
    return {
      content,
      title
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