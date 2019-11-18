import React, { useEffect, useContext } from 'react';
import editorContext from '@context/editor/editorContext';
import ArticleCatalog from '@components/article-catalog';
// import { INTRODUCE_MARKDOWN } from '@config/index';
import axiosInstance from '@util/axiosInstance';
import {
  debunce,
  getIn
} from '@util/util.js';
import './index.css';

/**
 *  初始化编辑器
 */
async function previewMarkdownToContainer(onload = console.log, onchange = console.log) {
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const [error, data] = await axiosInstance.get(`doc/detail?doc_id=${docId}`);
  // TODO 区分当前文档的作者，如果是作者本人显示草稿内容，非本人显示真实文本
  const markdown = getIn(data, ['markdown'], '');
  if (!getIn(data, ['doc_id'])) {
    // TODO 报错如何处理
    console.log('[获取文档信息失败]', error, data);
    return;
  }
  const editor = window.editormd('editormd_edit', {
    toolbar: true,
    path: '/editor/lib/', // Autoload modules mode, codemirror, marked... dependents libs path
    disabledKeyMaps: ['Ctrl-S', 'F11', 'F10'],
    placeholder: '开始吧！！',
    searchReplace: true,
    markdown,
    codeFold: true,
    theme: 'default',
    previewTheme: 'default',
    editorTheme: 'default',
    emoji: true,
    tex: true,
    tocm: true,
    watch: false
  });
  const debunceEditorChange = debunce(function () {
    onchange(arguments[0]);
  }).bind(this);
  editor.settings.onload = () => {
    onload(editor, data);
    editor.cm.on('change', () => {
      debunceEditorChange(editor);
    });
  };
  return editor;
}
/**
 *  鼠标hover编辑器上的图标，给予文字提示
 */
function addToolTipForEditorIcon() {
  const oEditormdMenus = document.querySelectorAll('.editormd-menu>li>a');
  if (oEditormdMenus.length > 0) {
    oEditormdMenus.forEach(oMenu => {
      const tips = $(oMenu).attr('title');
      $(oMenu).attr('title', '');
      const toolTip = `<div class="editormd-custom-toolTip">${tips}</div>`;
      $(oMenu).append(toolTip);
      oMenu.addEventListener('mouseover', (e) => {
        e.currentTarget.children[1].style.display = 'block';
      });
      oMenu.addEventListener('mouseout', (e) => {
        e.currentTarget.children[1].style.display = 'none';
      });
    });
  }
}

export default function Editormd() {
  const { updateEditorInfo } = useContext(editorContext);
  function insertTitleInput (doc) {
    const $CodeMirror = $('.CodeMirror');
    const titleDom =
    '<div class="CodeMirror_title flex">' +
    '<div class="CodeMirror_titlle_left flex"><img src="/images/title.png" alt="标题" /></div>' +
    `<input value='${doc.title}' />` +
    '</div>';
    if ($CodeMirror.length > 0) {
      $(titleDom).insertBefore($($('.CodeMirror').children()[0]));
    }
  }
  useEffect(() => {
    previewMarkdownToContainer((e, doc) => {
      addToolTipForEditorIcon();
      insertTitleInput(doc);
      updateEditorInfo(e);
    }, (e) => { updateEditorInfo(e); });
  }, []);
  return (
    <div className="Editormd_Wrapper flex">
      <div className="Editormd">
        <div id="editormd_edit"></div>
      </div>
      <ArticleCatalog
        dynamic={true} />
    </div>
  );
};