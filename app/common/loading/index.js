import React, { useCallback, useRef } from 'react';
import './index.css';

export default function Loading({
  className = '',
  show = false,
  img = '/images/loading.svg',
  style = {}
}) {
  const loadingRef = useRef(null);
  const onTransitionEnd = useCallback(() => {
    loadingRef.current.style.display = 'none';
  }, []);

  return (
    <div
      className={$.trim(`loading ${className} ${show ? '' : 'loading-hide'}`)}
      style={style}
      ref={loadingRef}
      onTransitionEnd={onTransitionEnd}>
      <img src={img}
        alt="loading" />
    </div>
  );
};