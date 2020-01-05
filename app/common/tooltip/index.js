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
  const [style, setStyle] = useState({});
  const [arrowStyle, setArrowStyle] = useState({});
  const innerRef = useRef(null);
  const tooltipRef = useRef(null);

  const getStyle = useCallback((dom, place) => {
    const { left, top, width } = dom.getBoundingClientRect();
    const rect = tooltipRef.current.getBoundingClientRect();
    // console.log('innerRef', dom.getBoundingClientRect());
    // console.log('toolTipRef', rect);
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    let posLeft = left + width / 2 - rect.width / 2;
    const posTop = top + scrollTop - rect.height - 5;
    if (rect.width > width) {
      posLeft = left;
    }
    setArrowStyle({
      left: `${rect.width / 2 - 7}px`
    });
    return {
      left: `${posLeft}px`,
      top: `${posTop}px`
    };
  }, []);

  const calcToolTipStyle = useCallback((place) => {
    setStyle(getStyle(innerRef.current, place));
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
              style={arrowStyle}></div>
          </div>
        </div>
        , document.body)}
    </div>
  );
};