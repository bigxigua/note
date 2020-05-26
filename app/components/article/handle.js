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
    const $code = $(item).find('>code').get(0);
    if ($(item).parent().find('.code-tooltip').length > 0) {
      break;
    }
    if ($code) {
      $(item).addClass('line-numbers');
      Prism.highlightElement($code);
    }
    const code = $(item).find('>code').length ? $(item).find('>code').html() : $(item).html();
    $(item).wrap($('<div class="article-pre__box" />'));
    setTimeout(() => {
      $(item).parent().append($('<div class="code-tooltip"></div>'));
      setTimeout(() => {
        const tooltip = $(item).parent().find('.code-tooltip').get(0);
        ReactDOM.render(<ToolBar code={code}
          dom={item} />, tooltip);
      }, 0);
    }, 0);
  }
}

// 监听img点击事件，实现点击预览
export function previewImage($container) {
  const imgs = Array.from($container.find('img')).filter(n => { return !n.getAttribute('data-emoji'); });
  imgs.forEach(img => {
    img.addEventListener('click', () => {
      const src = img.src;
      console.log(img);
    }, false);
  });
  console.log(imgs);
}
