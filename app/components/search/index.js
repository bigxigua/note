import React, { useEffect, useRef } from 'react';
import Icon from '@common/icon';
import './index.css';

export default function Search({
  className = '',
  onChange = () => {},
  onEnter = () => {}
}) {
  const input = useRef(null);
  useEffect(() => {
    input.current.addEventListener('keyup', (e) => {
      if (+e.keyCode === 13) {
        onEnter(input.current.value);
      }
    }, false);
  }, []);
  return (
    <div className={`Search ${className}`}>
      <Icon type="search" />
      <input type="text"
        ref={input}
        placeholder="搜索试试"
        autoComplete="off"
        spellCheck="true"
        onChange={onChange}
        className="Search_input" />
    </div>
  );
}