import ReactDOM from 'react-dom';
import React from 'react';
import Tooltip from '@common/tooltip';

function ToolBar() {
  console.log(';----');
  return (
    <>
      <div className="code-tooltip__item flex">
        <Tooltip tips="复制"
          className="code-tooltip__item-tooltip">
          <img src="/images/notes.png"
            alt="copy" />
        </Tooltip>
      </div>
    </>
  );
}

// 预览html，用prism转pre>code
export function codeBeautiful(pre, Prism) {
  if (!pre || pre.length === 0) return;
  Array.from(pre).forEach(item => {
    Prism.highlightElement(item);
    $(item).append($('<div class="code-tooltip" />'));
    ReactDOM.render(<ToolBar dom={item} />, document.querySelector('.code-tooltip'));
  });
}