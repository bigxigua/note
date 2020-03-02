import React, { useCallback, useRef } from 'react';
import './index.css';

export default function Image({
  style = {},
  className = '',
  src = '',
  alt = '',
  errorImg = ''
}) {
  const imgRef = useRef(null);
  const onError = useCallback((e) => {
    // console.log(e);
    // imgRef.current.src = errorImg;
  }, [errorImg]);
  return (
    <img
      className={$.trim(`image ${className}`)}
      style={style}
      src={src}
      alt={alt}
      ref={imgRef}
      onError={onError} />
  );
};