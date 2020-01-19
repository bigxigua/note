import { getIn, checkBrowser, addKeydownListener } from '@util/util';
import axiosInstance, { fetchApi } from '@util/axiosInstance';

const { isMobile } = checkBrowser();

// 获取标题
export function getTitle(docInfo = {}, content) {
  const title = docInfo.title_draft || docInfo.title;
  return content === 'origin' ? docInfo.title : title;
}

// 获取文档信息
export async function fetchDocDetail() {
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const [, data] = await axiosInstance.get(`docs?type=detail&docId=${docId}`);
  return getIn(data, [0], {}) || {};
}

export function insertTitleInputToSimditor(doc, content) {
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

// 监听键盘事件，设置快捷键操作
export function monitorKeyupHandle({ save, simditor }) {
  if (isMobile) return;
  return addKeydownListener({
    handle: ({ keyCode, ctrlKey, e }) => {
      if (ctrlKey && keyCode === 83) {
        e.preventDefault();
        console.log(simditor);
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