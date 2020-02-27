import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { checkBrowser } from '@util/util';
import './index.css';

const { isMobile } = checkBrowser();
const SHOW_CLASSNAME = 'popover-wrapper__content_show';

const loop = () => { };

export default function Popover({
  className = '',
  children = '',
  content = '',
  popoverToggleOpen = loop,
  renderToBody = true // 是否渲染在body上
}) {
  const [style, setStyle] = useState([]);
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const arrowRef = useRef(null);

  const showPopover = useCallback(() => {
    contentRef.current.classList.add(SHOW_CLASSNAME);
    popoverToggleOpen(true);
    calcPosition();
  }, []);

  const hidePopover = useCallback(() => {
    contentRef.current.classList.remove(SHOW_CLASSNAME);
    popoverToggleOpen(false);
  }, []);

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

  // pc端绑定mouse事件
  const bindEvent = useCallback(() => {
    const mouseenterFn = () => {
      showPopover();
    };
    const mouseleaveFn = () => {
      hidePopover();
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
      hidePopover();
    } else {
      showPopover();
    }
  }, []);

  // 失去焦点
  const onBlur = useCallback(() => {
    setTimeout(() => {
      hidePopover();
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

  // 内容
  function Box() {
    return (<div className="popover-wrapper_box animated">
      <div ref={contentRef}
        className="popover-wrapper__content"
        style={style}>
        <div ref={arrowRef}
          className="popover_wrapper_arrow"></div>
        {content}
      </div>
    </div>);
  };

  return (
    <div className={$.trim(`popover-wrapper ${className}`)}
      tabIndex="1"
      onClick={onBindClick}
      onBlur={onBlur}
      ref={wrapperRef}>
      {children}
      {renderToBody ? ReactDOM.createPortal(Box(), document.body) : <Box />}
    </div>
  );
};