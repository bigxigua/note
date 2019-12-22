import React, { useEffect, useContext, useRef } from 'react';
import editorContext from '@context/editor/editorContext';
import ArticleCatalog from '@components/article-catalog';
import { debunce, parseUrlQuery, addKeydownListener, checkBrowser } from '@util/util';
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
    placeholder: '开始吧！！',
    searchReplace: true,
    markdown: md,
    codeFold: true,
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

const { isMobile } = checkBrowser();

export default function Editormd({ docInfo }) {
  const { content = 'draft', spaceId = '' } = parseUrlQuery();
  const { updateEditorInfo } = useContext(editorContext);
  const update = useSaveContent({ spaceId });
  const editorArea = useRef(null);
  const editormd = useRef(null);

  /**
 *  监听键盘事件，设置快捷键操作
 */
  function monitorKeyupHandle() {
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
        // console.log({ keyCode, ctrlKey, e });
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

  let editormdClasses = 'Editormd ';
  editormdClasses += `${isMobile ? 'editormd_mobile' : ''}`;

  return (
    <div className="Editormd_Wrapper flex">
      <div id="preview-container"></div>
      <div className={editormdClasses}>
        <div id="editormd_edit"
          ref={editorArea}></div>
      </div>
      {!isMobile && <ArticleCatalog dynamic={true} />}
    </div>
  );
};