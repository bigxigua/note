import React from 'react';
import Icon from '@common/icon';
import './index.css';

export default function Search(props) {
  const {
    className = ''
  } = props;
  return (
    <div className={`Search ${className}`}>
      <Icon type="search" />
      <input type="text"
        placeholder="搜索试试"
        autoComplete="off"
        spellCheck="true"
        className="Search_input" />
    </div>
  );
}