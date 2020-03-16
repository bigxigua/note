import React, { useState, useCallback } from 'react';
import Icon from '@common/icon';
import AutoComplete from '@common/auto-complete';
import { getIn } from '@util/util';
import axiosInstance from '@util/axiosInstance';
import './index.css';

const search = async (q) => {
  const [, data] = await axiosInstance.post('search', { q });
  const docs = getIn(data, ['docs'], []).map(n => {
    return {
      ...n,
      __type__: 'doc',
      text: n.title
    };
  });
  const spaces = getIn(data, ['spaces'], []).map(n => {
    return {
      ...n,
      __type__: 'space',
      text: n.name
    };
  });
  return [...docs, ...spaces];
};

export default function HeaderSearch({
  className = ''
}) {
  const [options, setOptions] = useState([]);

  const onSearchValueChange = useCallback(async (e) => {
    // TODO 如何保证搜索结果准确性和节流
    const result = await search(e.currentTarget.value);
    setOptions(result);
  }, [options]);

  const onSearchValueSelect = useCallback(async (info) => {
    const { __type__, url, space_id } = info;
    if (__type__ === 'doc') {
      window.open(url, '_blank');
    } else if (__type__ === 'space') {
      window.open(`${window.location.origin}/spacedetail?spaceId=${space_id}`, '_blank');
    }
  }, []);

  const prefixCls = $.trim(`header-search ${className}`);
  return (
    <div className={prefixCls}>
      <Icon type="search" />
      <AutoComplete
        placeholder="搜索文档或者空间"
        onChange={onSearchValueChange}
        onSelect={onSearchValueSelect}
        options={options} />
    </div>
  );
}