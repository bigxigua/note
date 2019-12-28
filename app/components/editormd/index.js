import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import editorContext from '@context/editor/editorContext';
import ArticleCatalog from '@components/article-catalog';
import { debunce, parseUrlQuery, addKeydownListener, checkBrowser } from '@util/util';
import useSaveContent from '@hooks/use-save-content';
import './index.css';

const { isMobile } = checkBrowser();
const mobileToolbars = [
  'bold', 'del', 'italic', 'quote', 'uppercase', 'lowercase',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'image', 'code', 'code-block', 'preformatted-text',
  'list-ul', 'list-ol', 'hr', 'clear', 'table'
];
/**
 *
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
  onSyncChange,
  onload
}) {
  let md = markdown_draft || markdown;
  if (content === 'origin') {
    md = markdown;
  }
  const editor = window.editormd('editormd_edit', {
    toolbar: true,
    path: '/editor/lib/', // Autoload modules mode, codemirror, marked... dependents libs path
    disabledKeyMaps: ['Ctrl-S'],
    toolbarIcons: isMobile ? mobileToolbars : 'full',
    placeholder: '开始吧！！',
    searchReplace: true,
    markdown: md,
    codeFold: true,
    lineNumbers: !isMobile,
    theme: 'default',
    previewTheme: 'default',
    editorTheme: 'default',
    emoji: true,
    tex: false,
    taskList: true,
    tocm: true,
    flowChart: true,
    // sequenceDiagram: true,
    watch: false
  });
  const debunceEditorChange = debunce(function () {
    onchange(arguments[0]);
  }).bind(this);
  editor.settings.onload = () => {
    onload(editor);
    editor.cm.on('change', () => {
      onSyncChange(editor);
      debunceEditorChange(editor);
    });
  };
}
/**
 *  鼠标hover编辑器上的图标，给予文字提示
 */
function addToolTipForEditorIcon() {
  if (isMobile) return;
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
    `<div class="CodeMirror_title ${isMobile ? 'codemirror_title_mobile' : ''} flex">` +
    '<div class="CodeMirror_title_left flex"><img src="/images/title.png" alt="标题" /></div>' +
    `<input maxlength="30" value='${title.substr(0, 30)}' />` +
    '</div>';
  if ($CodeMirror.length > 0) {
    $(titleDom).insertBefore($($('.CodeMirror').children()[0]));
  }
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

/**
 *  移动端保存悬浮按钮
 */
function renderSaveIconForMobile(update, editormd) {
  if (!isMobile) return null;
  return <div className="mobile_save"
    onClick={() => update(editormd.current)}>
    <img src="/images/save.svg" />
  </div>;
}

export default function Editormd({ docInfo }) {
  const { content = 'draft', spaceId = '' } = parseUrlQuery();
  const [classes, setClassess] = useState(`Editormd ${isMobile ? 'editormd_mobile' : ''}`);
  const { updateEditorInfo } = useContext(editorContext);
  const update = useSaveContent({ spaceId });
  const editorArea = useRef(null);
  const editormd = useRef(null);

  /**
   *  监听键盘事件，设置快捷键操作
   */
  function monitorKeyupHandle() {
    if (isMobile) return;
    return addKeydownListener({
      handle: ({ keyCode, ctrlKey, e }) => {
        // Ctrl-S,保存
        if (ctrlKey && keyCode === 83) {
          e.preventDefault();
          update(editormd.current);
        }
        // Ctrl-J,全屏预览
        if (ctrlKey && keyCode === 74) {
          if (editormd.current.isPreving) return;
          e.preventDefault();
          const markdown = editormd.current.getMarkdown();
          editormd.current.markdownToHTML('preview-container', {
            ...editormd.current.settings,
            markdown
          });
          editormd.current.isPreving = true;
          updateEditorInfo(editormd.current);
        }
        // esc 退出操作
        if (keyCode === 27) {
          if (editormd.current.isPreving) {
            editormd.current.closeMarkdownToHTML('preview-container');
            editormd.current.isPreving = false;
            updateEditorInfo(editormd.current);
          }
          e.preventDefault();
        }
      }
    });
  }

  useEffect(() => {
    if (!docInfo) return;
    previewMarkdownToContainer({
      content,
      docInfo,
      onload: (e) => {
        addToolTipForEditorIcon();
        insertTitleInput(docInfo, content);
        updateEditorInfo(e);
        monitorKeyupHandle();
        editormd.current = e;
      },
      onchange: (e) => {
        updateEditorInfo(e);
      },
      onSyncChange: (e) => {
        editormd.current = e;
      }
    });
    // window.addEventListener('beforeunload', (e) => {
    //   const confirmationMessage = '要记得保存！你确定要离开我吗？';
    //   (e || window.event).returnValue = confirmationMessage;
    //   return confirmationMessage;
    // });
  }, [docInfo, content]);

  const catalogsUpdate = useCallback((list) => {
    if (list.length === 0) {
      setClassess(classes + ' editormd_mobile');
    }
  }, []);

  return (
    <div className="Editormd_Wrapper flex">
      <div id="preview-container"></div>
      <div className={classes}>
        <div id="editormd_edit"
          ref={editorArea}></div>
      </div>
      <ArticleCatalog
        catalogsUpdate={catalogsUpdate}
        dynamic={true} />
      {renderSaveIconForMobile(update, editormd)}
    </div>
  );
};