import ReactDOM from 'react-dom';
import React, { useRef } from 'react';
import useMessage from '@hooks/use-message';
import Tooltip from '@common/tooltip';

const message = useMessage();

function onCopy(code, copyInput) {
  copyInput.current.select();
  copyInput.current.setSelectionRange(0, 99999);
  document.execCommand('copy');
  message.success({
    content: '复制成功'
  });
}

function ToolBar({ code = '', dom = null }) {
  const inputRef = useRef(null);
  const language = (($(dom).attr('class').split(' ').find(l => /language-/.test(l)) || '').split('-') || [])[1];
  return (
    <>
      <div className="code-tooltip__item flex">
        <Tooltip tips="复制"
          className="code-tooltip__item-tooltip">
          <img src="/images/notes.png"
            onClick={() => { onCopy(code, inputRef); }}
            alt="copy" />
          <input
            ref={inputRef}
            type="text"
            onChange={() => { }}
            value={code.replace(/\&nbsp;/gi, '')} />
        </Tooltip>
      </div>
      <div className="code-tooltip__item flex">
        <Tooltip tips="语言"
          className="code-tooltip__item-tooltip">
          {language}
        </Tooltip>
      </div>
    </>
  );
}

// 预览html，用prism转pre>code
export function codeBeautiful(pre, Prism) {
  if (!pre || pre.length === 0) return;
  for (let i = 0, len = Array.from(pre).length; i < len; i++) {
    const item = Array.from(pre)[i];
    if ($(item).find('.code-tooltip').length > 0) {
      break;
    }
    const code = $(item).find('>code').length ? $(item).find('>code').html() : $(item).html();
    Prism.highlightElement(item);
    $(item).append($('<div class="code-tooltip" />'));
    const tooltip = $(item).find('.code-tooltip').get(0);
    // setTimeout(() => {
    //   console.log();
    //   const { left, top, width, height } = item.getBoundingClientRect();
    //   const { width: curWidth } = tooltip.getBoundingClientRect();
    //   $(tooltip).css({ left: `${left + width - curWidth}px`, top: `${top - height}px` });
    // }, 0);
    ReactDOM.render(<ToolBar dom={item}
      code={code} />, tooltip);
  }
}