import React, { useEffect, useState, useRef, useCallback } from 'react';
import './index.css';

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
    $(wrapperRef.current).mouseenter(() => {
      $(contentRef.current).addClass(SHOW_CLASSNAME);
      calcPosition();
    });
    $(wrapperRef.current).mouseleave(() => {
      $(contentRef.current).removeClass(SHOW_CLASSNAME);
    });
  }, []);

  useEffect(() => {
    calcPosition();
    bindEvent();
    return () => { };
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