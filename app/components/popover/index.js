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
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

    let l = left - $(contentRef.current).width() / 2 + 5;
    const h = top + scrollTop + height;
    if (l < 0) {
      l = 10;
    }
    setStyle({
      left: `${l < 0 ? 10 : l}px`,
      top: `${h}px`
    });
    arrowRef.current.style.left = `${(left + width / 2) - l}px`;
  }, []);

  // 绑定mouse事件
  const bindEvent = useCallback(() => {
    const mouseenterFn = () => {
      $(contentRef.current).addClass(SHOW_CLASSNAME);
      calcPosition();
    };
    const mouseleaveFn = () => {
      $(contentRef.current).removeClass(SHOW_CLASSNAME);
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

  // 绑定click事件
  const bindClickEvent = useCallback(() => {
    const fn = function () {
      const hasClass = $(contentRef.current).hasClass(SHOW_CLASSNAME);
      contentRef.current.classList.remove(SHOW_CLASSNAME);
      !hasClass && $(contentRef.current).addClass(SHOW_CLASSNAME);
      calcPosition();
    };
    wrapperRef.current.addEventListener('click', fn, false);
    contentRef.current.addEventListener('click', fn, false);
    // TODO 点击其他地方隐藏
    return [{ name: 'click', fn }];
  }, []);

  useEffect(() => {
    const listeners = isMobile ? bindClickEvent() : bindEvent();
    return () => {
      listeners.forEach(({ name, fn }) => {
        wrapperRef.current.removeEventListener(name, fn);
        contentRef.current.removeEventListener(name, fn);
      });
    };
  }, []);
  return (
    <div className={`Popover_Wrapper ${className}`}
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