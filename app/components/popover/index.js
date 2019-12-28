import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  const childRef = useRef(null);

  const calcPosition = useCallback(() => {
    if (!wrapperRef.current) return;
    const {
      left,
      top,
      height
    } = wrapperRef.current.getBoundingClientRect();
    setStyle({
      left: `${left - $(contentRef.current).width() + $(childRef.current).width() + 21}px`,
      top: `${top + height}px`
    });
  }, []);

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
    return [{
      name: 'mouseenter',
      fn: mouseenterFn
    }, {
      name: 'mouseleave',
      fn: mouseleaveFn
    }];
  }, []);

  const bindClickEvent = useCallback(() => {
    const fn = function () {
      const hasClass = $(contentRef.current).hasClass(SHOW_CLASSNAME);
      $('.Popover_Wrapper_Content').removeClass(SHOW_CLASSNAME);
      !hasClass && $(contentRef.current).addClass(SHOW_CLASSNAME);
      calcPosition();
    };
    wrapperRef.current.addEventListener('click', fn, false);
    return [{ name: 'click', fn }];
  }, []);

  useEffect(() => {
    calcPosition();
    const listeners = isMobile ? bindClickEvent() : bindEvent();
    return () => {
      listeners.forEach(({ name, fn }) => {
        wrapperRef.current.removeEventListener(name, fn);
      });
    };
  }, []);

  return (
    <div ref={wrapperRef}
      className={`Popover_Wrapper ${className}`}>
      <div ref={childRef}
        className="Popover_Wrapper_Child flex">{children}</div>
      <div className="Popover_Wrapper_Box animated">
        <div ref={contentRef}
          className="Popover_Wrapper_Content"
          style={style}>
          {content}
        </div>
      </div>
    </div>
  );
};