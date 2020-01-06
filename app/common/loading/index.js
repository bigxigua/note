import React from 'react';
import './index.css';

export default function Loading({
  className = '',
  style = {}
}) {
  return (
    <ul className={`loading ${className}`}
      style={style}>
      <li className="loading-item loading-item-1"></li>
      <li className="loading-item loading-item-2"></li>
      <li className="loading-item loading-item-3"></li>
      <li className="loading-item loading-item-4"></li>
      <li className="loading-item loading-item-5"></li>
      <li className="loading-item loading-item-6"></li>
      <li className="loading-item loading-item-7"></li>
      <li className="loading-item loading-item-8"></li>
      <li className="loading-item loading-item-9"></li>
    </ul>
  );
};