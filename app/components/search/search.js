import React from 'react';
import Icon from '@common/icon';
import './search.css';

export default function Search() {
  return (
    <div className="Search">
      <Icon type="search" />
      <input type="text"
        placeholder="搜索试试"
        autoComplete="off"
        spellCheck="true"
        className="Search_input" />
    </div>
  );
}