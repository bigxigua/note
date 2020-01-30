import React, { useCallback, useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const SHOW_CLASSNAME = 'tooltip_show';

export default function Tooltip({
  className = '',
  tips = '',
  placement = 'top', // 气泡框位置，可选 top left right bottom
  children = null
}) {
  // TODO mobile return null;
  const [style, setStyle] = useState({});
  const innerRef = useRef(null);
  const tooltipRef = useRef(null);
  const arrowRef = useRef(null);

  const getStyle = useCallback((dom) => {
    const { left, top, height, width } = dom.getBoundingClientRect();
    const { width: contentWidth, height: contentHeight } = tooltipRef.current.getBoundingClientRect();
    // 窗口滚动高度
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    // 窗口宽度
    const bodyWidth = document.body.getBoundingClientRect().width;
    let l = left + width / 2 - contentWidth / 2 + 5;
    const h = top + scrollTop - contentHeight - height + 10;
    // 如果tooltip内容宽度大于元素dom宽度
    if (contentWidth > width) {
      l = left - (contentWidth / 2 - width / 2);
    }

    if (l < 10) { l = 10; }
    if (l + contentWidth >= bodyWidth) {
      l = bodyWidth - contentWidth - 10;
    }
    // 设置气泡框箭头位置
    // arrowRef.current.style.left = `${(left + width / 2) - l}px`;
    const arrowWidth = arrowRef.current.getBoundingClientRect().width;
    arrowRef.current.style.left = `${contentWidth / 2 - arrowWidth / 2}px`;

    return {
      left: `${l}px`,
      top: `${h}px`
    };
  }, []);

  const calcToolTipStyle = useCallback(() => {
    setStyle(getStyle(innerRef.current));
  }, []);

  const bindMouseEvent = useCallback((placement) => {
    const mouseenterFn = () => {
      tooltipRef.current.classList.add(SHOW_CLASSNAME);
      calcToolTipStyle(placement);
    };
    const mouseleaveFn = () => {
      tooltipRef.current.classList.remove(SHOW_CLASSNAME);
    };
    innerRef.current.addEventListener('mouseenter', mouseenterFn, false);
    innerRef.current.addEventListener('mouseleave', mouseleaveFn, false);
    tooltipRef.current.addEventListener('mouseenter', mouseenterFn, false);
    tooltipRef.current.addEventListener('mouseleave', mouseleaveFn, false);
    return [{
      name: 'mouseenter',
      fn: mouseenterFn
    }, {
      name: 'mouseleave',
      fn: mouseleaveFn
    }];
  }, []);

  useEffect(() => {
    const listeners = bindMouseEvent(placement);
    return () => {
      listeners.forEach(({ name, fn }) => {
        innerRef.current.removeEventListener(name, fn);
        tooltipRef.current.removeEventListener(name, fn);
      });
    };
  }, [placement]);

  return (
    <div ref={innerRef}
      className={`${className}`}>
      {children}
      {ReactDOM.createPortal(
        <div className="tooltip_wrapper">
          <div className="tooltip animated"
            ref={tooltipRef}
            style={style}>
            <div className="tooltip_content">{tips}</div>
            <div className="tooltip_arrow"
              ref={arrowRef}></div>
          </div>
        </div>
        , document.body)}
    </div>
  );
};