import React, { useState, useCallback, useMemo } from 'react';
import Icon from '@common/icon';
import AutoComplete from '@common/auto-complete';
import { getIn, debunce, transformIpToDomain } from '@util/util';
import axiosInstance from '@util/axiosInstance';
import './index.css';

let curValue = '';

const search = async (q, setOptions, setOpen) => {
  setOpen('loading');
  const [, data] = await axiosInstance.post('search', { q });
  const docs = getIn(data, ['docs'], []).map(n => {
    return {
      ...n,
      icon: 'file-text',
      __type__: 'doc',
      text: n.title
    };
  });
  const spaces = getIn(data, ['spaces'], []).map(n => {
    return {
      ...n,
      __type__: 'space',
      icon: 'folder',
      text: n.name
    };
  });
  const result = [...docs, ...spaces];
  if (curValue === q) {
    setOptions(result);
    setOpen(true);
  }
  return result;
};

/**
* 搜索文档/空间组件
* @param {string} className - className
*/
export default function HeaderSearch({
  className = ''
}) {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(true);

  const onSearchValueChange = useMemo(() => {
    return debunce(async (e) => {
      const value = e.target.value.trim();
      curValue = value;
      if (!value) {
        setOptions([]);
        setOpen(false);
        return;
      }
      search(value, setOptions, setOpen);
    }, 500);
  }, [options]);

  const onSearchValueSelect = useCallback(async (info) => {
    const { __type__, url, space_id } = info;
    if (__type__ === 'doc') {
      window.open(transformIpToDomain(url), '_blank');
    } else if (__type__ === 'space') {
      window.open(`${window.location.origin}/spacedetail?spaceId=${space_id}`, '_blank');
    }
  }, []);

  const prefixCls = $.trim(`header-search ${className}`);
  return (
    <div className={prefixCls}>
      <Icon type="search" />
      <AutoComplete
        open={open}
        placeholder="搜索文档或者空间"
        onChange={onSearchValueChange}
        onSelect={onSearchValueSelect}
        onBlur={() => { }}
        onFocus={() => { setOpen(true); }}
        options={options} />
    </div>
  );
}