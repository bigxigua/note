import React, { useEffect, useState, useRef } from 'react';
import './index.css';

export default function Popover({
  className = '',
  children = '',
  content = ''
}) {
  const [style, setStyle] = useState([]);
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const childRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      const {
        left,
        top,
        height
      } = wrapperRef.current.getBoundingClientRect();
      setStyle({
        left: `${left - $(contentRef.current).width() + $(childRef.current).width() + 25}px`,
        top: `${top + height}px`
      });
    }, 500);
  }, []);
  // TODO resize时重新计算
  return (
    <div ref={wrapperRef}
      className={`Popover_Wrapper flex ${className}`}>
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