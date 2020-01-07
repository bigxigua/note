import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { checkBrowser } from '@util/util';
import './index.css';

const { isMobile } = checkBrowser();
const SHOW_CLASSNAME = 'Popover_Wrapper_Content_show';

export default function Popover({
  className = '',
  children = '',
  content = ''
}) {
  const [style, setStyle] = useState([]);
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const arrowRef = useRef(null);

  const calcPosition = useCallback(() => {
    if (!wrapperRef.current) return;
    const {
      left,
      top,
      width,
      height
    } = wrapperRef.current.getBoundingClientRect();
    // 内容宽度
    const contentWidth = $(contentRef.current).width();
    // 窗口滚动高度
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    // 窗口宽度
    const bodyWidth = document.body.getBoundingClientRect().width;
    let l = left - contentWidth / 2 + 5;
    const h = top + scrollTop + height;
    if (l < 10) { l = 10; }
    if (l + contentWidth >= bodyWidth) {
      l = bodyWidth - contentWidth - 10;
    }
    setStyle({
      left: `${l}px`,
      top: `${h}px`
    });
    arrowRef.current.style.left = `${(left + width / 2) - l}px`;
  }, []);

  // 绑定mouse事件
  const bindEvent = useCallback(() => {
    const mouseenterFn = () => {
      contentRef.current.classList.add(SHOW_CLASSNAME);
      calcPosition();
    };
    const mouseleaveFn = () => {
      contentRef.current.classList.remove(SHOW_CLASSNAME);
    };
    wrapperRef.current.addEventListener('mouseenter', mouseenterFn, false);
    wrapperRef.current.addEventListener('mouseleave', mouseleaveFn, false);
    contentRef.current.addEventListener('mouseenter', mouseenterFn, false);
    contentRef.current.addEventListener('mouseleave', mouseleaveFn, false);
    return [{
      name: 'mouseenter',
      fn: mouseenterFn
    }, {
      name: 'mouseleave',
      fn: mouseleaveFn
    }];
  }, []);

  // 移动端绑定click事件
  const onBindClick = useCallback((e) => {
    if (!isMobile) return;
    e.stopPropagation();
    const hasClass = Array.from(contentRef.current.classList).includes(SHOW_CLASSNAME);
    if (hasClass) {
      contentRef.current.classList.remove(SHOW_CLASSNAME);
    } else {
      contentRef.current.classList.add(SHOW_CLASSNAME);
      calcPosition();
    }
  }, []);

  // 失去焦点
  const onBlur = useCallback(() => {
    setTimeout(() => {
      contentRef.current.classList.remove(SHOW_CLASSNAME);
    }, 0);
  }, []);

  useEffect(() => {
    const listeners = isMobile ? [] : bindEvent();
    return () => {
      listeners.forEach(({ name, fn }) => {
        wrapperRef.current.removeEventListener(name, fn);
        contentRef.current.removeEventListener(name, fn);
      });
    };
  }, []);
  return (
    <div className={`Popover_Wrapper ${className}`}
      tabIndex="1"
      onClick={onBindClick}
      onBlur={onBlur}
      ref={wrapperRef}>
      {children}
      {ReactDOM.createPortal(
        <div className="Popover_Wrapper_Box animated">
          <div ref={contentRef}
            className="Popover_Wrapper_Content"
            style={style}>
            <div ref={arrowRef}
              className="popover_wrapper_arrow"></div>
            {content}
          </div>
        </div>
        , document.body)}
    </div>
  );
};