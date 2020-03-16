import React, { useState, useCallback } from 'react';
import Icon from '@common/icon';
import AutoComplete from '@common/auto-complete';
import { checkBrowser } from '@util/util';
import './index.css';

export default function HeaderSearch({
  className = ''
}) {
  const [options, setOptions] = useState([]);
  const onSearchValueChange = useCallback((e) => {
    console.log(e.currentTarget.value);
    // 根据value请求搜索接口，更新options
    setOptions([].concat(options, [{ text: Math.random() }]));
  }, [options]);
  const prefixCls = $.trim(`header-search ${className}`);
  return (
    <div className={prefixCls}>
      <Icon type="search" />
      <AutoComplete
        placeholder="搜索文档或者空间"
        onChange={onSearchValueChange}
        options={options} />
    </div>
  );
}