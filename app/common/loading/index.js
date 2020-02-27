import React, { useCallback, useRef, useEffect, useState } from 'react';
import './index.css';

export default function Loading({
  className = '',
  show = false,
  img = '/images/loading.svg',
  style = {}
}) {
  const loadingRef = useRef(null);
  const [visible, setVisible] = useState(show);

  const onTransitionEnd = useCallback(() => {
    loadingRef.current.style.display = 'none';
  }, []);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  return (
    <div
      className={$.trim(`loading ${className} ${visible ? '' : 'loading-hide'}`)}
      style={style}
      ref={loadingRef}
      onTransitionEnd={onTransitionEnd}>
      <img src={img}
        alt="loading" />
    </div>
  );
};