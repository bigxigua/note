import React, { useEffect, useContext, useRef } from 'react';
import editorContext from '@context/editor/editorContext';
import ArticleCatalog from '@components/article-catalog';
import { debunce } from '@util/util';
import useSaveContent from '@hooks/use-save-content';
import './index.css';

/**
 *  初始化编辑器
 */
async function previewMarkdownToContainer({
  docInfo: { markdown },
  onchange,
  onload
}) {
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

export default function Editormd({ docInfo }) {
  const { updateEditorInfo } = useContext(editorContext);
  const update = useSaveContent({});
  const editorArea = useRef(null);
  function insertTitleInput(doc) {
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
  function interceptKeyUp(editor) {
    document.onkeydown = function (e) {
      const keyCode = e.keyCode || e.which || e.charCode;
      const ctrlKey = e.ctrlKey || e.metaKey;
      // TODO ctrl+S保存 ctrl+Q 预览
      if (ctrlKey && keyCode === 83) {
        e.preventDefault();
        update(editor);
        return false;
      }
    };
  }
  useEffect(() => {
    if (!docInfo) {
      return;
    }
    previewMarkdownToContainer({
      docInfo,
      onload: (e) => {
        addToolTipForEditorIcon();
        insertTitleInput(docInfo);
        updateEditorInfo(e);
        interceptKeyUp(e);
      },
      onchange: (e) => {
        updateEditorInfo(e);
      }
    });
  }, [docInfo]);
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