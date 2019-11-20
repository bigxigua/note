import React from 'react';
import './index.css';

export default function Empty({
  imageStyle = {},
  style = {},
  description = '',
  className = '',
  image = Empty.PRESENTED_IMAGE_DEFAULT
}) {
  return (
    <div
      className={`Empty ${className}`}
      style={style}>
      <img src={image}
        style={imageStyle}
        alt="空空如也" />
      <div className="Empty_Desc">
        {description || '哎呀～这里什么都没有'}
      </div>
    </div>
  );
};

Empty.PRESENTED_IMAGE_DEFAULT = '/images/basket_empty.png';