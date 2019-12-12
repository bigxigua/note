import React, { useEffect, useContext, useRef } from 'react';
import editorContext from '@context/editor/editorContext';
import ArticleCatalog from '@components/article-catalog';
import { debunce, parseUrlQuery } from '@util/util';
import useSaveContent from '@hooks/use-save-content';
import './index.css';
/**
 *  初始化编辑器
 *  @content {String} 默认显示草稿还是最新内容(draft/origin)
 *  @docInfo {Object} 文档信息
 *  @onchange {Object} 文档内容改变触发
 *  @onload {Object} 文档内容初次加载完毕触发
 */
async function previewMarkdownToContainer({
  content,
  docInfo: { markdown, markdown_draft },
  onchange,
  onload
}) {
  let md = markdown_draft || markdown;
  if (content === 'origin') {
    md = markdown;
  }
  const editor = window.editormd('editormd_edit', {
    toolbar: true,
    path: '/editor/lib/', // Autoload modules mode, codemirror, marked... dependents libs path
    disabledKeyMaps: ['Ctrl-S', 'F11', 'F10'],
    placeholder: '开始吧！！',
    searchReplace: true,
    markdown: md,
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
    onload(editor);
    editor.cm.on('change', () => {
      debunceEditorChange(editor);
    });
  };
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

/**
 *  插入标题input
 */
function insertTitleInput(doc, content) {
  const $CodeMirror = $('.CodeMirror');
  const title = getTitle(doc, content);
  const titleDom =
    '<div class="CodeMirror_title flex">' +
    '<div class="CodeMirror_titlle_left flex"><img src="/images/title.png" alt="标题" /></div>' +
    `<input value='${title}' />` +
    '</div>';
  if ($CodeMirror.length > 0) {
    $(titleDom).insertBefore($($('.CodeMirror').children()[0]));
  }
}

/**
 *  ctrl+S保存 ctrl+Q 预览
 */
function interceptKeyUp(editor, update) {
  document.onkeydown = function (e) {
    const keyCode = e.keyCode || e.which || e.charCode;
    const ctrlKey = e.ctrlKey || e.metaKey;
    // Ctrl-S
    if (ctrlKey && keyCode === 83) {
      e.preventDefault();
      update(editor);
      return false;
    }
  };
}

/**
 *  获取标题
 */
function getTitle(docInfo = {}, content) {
  let title = docInfo.title_draft || docInfo.title;
  if (content === 'origin') {
    title = docInfo.title;
  }
  return title;
}

export default function Editormd({ docInfo }) {
  const { content = 'draft', spaceId = '' } = parseUrlQuery();
  const { updateEditorInfo } = useContext(editorContext);
  const update = useSaveContent({ spaceId });
  const editorArea = useRef(null);
  useEffect(() => {
    if (!docInfo) {
      return;
    }
    previewMarkdownToContainer({
      content,
      docInfo,
      onload: (e) => {
        addToolTipForEditorIcon();
        insertTitleInput(docInfo, content);
        updateEditorInfo(e);
        interceptKeyUp(e, update);
      },
      onchange: (e) => {
        updateEditorInfo(e);
      }
    });
  }, [docInfo, content]);
  return (
    <div className="Editormd_Wrapper flex">
      <div className="Editormd">
        <div id="editormd_edit"
          ref={editorArea}></div>
      </div>
      <ArticleCatalog
        dynamic={true} />
    </div>
  );
};