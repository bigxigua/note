import React, { useState, useEffect } from 'react';
// import userContext from '../../context/user/userContext.js';
import ArticleCatalog from '../article-catalog/index.js';
import { INTRODUCE_MARKDOWN } from '../../config/index';
import {
  debunce
} from '../../util/util.js';
import './index.css';

/**
 *  初始化编辑器
 */
function previewMarkdownToContainer(onload = console.log, onchange = console.log) {
  const editor = window.editormd('editormd_edit', {
    path: '/editor/lib/', // Autoload modules mode, codemirror, marked... dependents libs path
    disabledKeyMaps: ['Ctrl-S', 'F11', 'F10'],
    placeholder: '开始吧！！',
    searchReplace: true,
    markdown: INTRODUCE_MARKDOWN,
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
    onchange(arguments);
  }).bind(this);
  editor.settings.onload = () => {
    onload(editor);
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
  const [editormd, setEditormd] = useState(false);
  useEffect(() => {
    previewMarkdownToContainer((e) => {
      setEditormd(e);
      addToolTipForEditorIcon();
    }, (e) => { setEditormd(e); });
  }, []);
  return (
    <div className="Editormd_Wrapper flex">
      <div className="Editormd">
        <div id="editormd_edit"></div>
      </div>
      <ArticleCatalog
        editormd={editormd}
        dynamic={true} />
    </div>
  );
};