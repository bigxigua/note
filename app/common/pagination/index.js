import React, { useState } from 'react';
import Icon from '@common/icon';
import './index.css';

/**
* @description Pagination 分页器
* @props {total} Number 总共页数
* @props {current} Number 当前页数
* @props {pageSize} Number 每页条数
* @props {onChange} Function(page, section, pageSize) 页码改变的回调
* @props {className} String 表格元素自定义类名
*/
export default function Pagination({
  className = '',
  style = {},
  total = 0,
  current = 1,
  pageSize = 10,
  onChange = () => {}
}) {
  if (!total) {
    return null;
  }
  const [currentItem, setCurrentItem] = useState(current);
  // 显示的取件， 默认 0-pageSize===》 0-10
  const [section, setSection] = useState([0, pageSize]);
  // prev/next按钮是否禁用
  const [disable, setDisable] = useState([current === 1, total === 1]);
  const paginationItems = new Array(Math.min(section[1] - section[0], total)).fill(section[0]).map((m, i) => m + i).map((n) => {
    return <li key={n}
      onClick={() => { onItemClick(n + 1); }}
      className={`Pagination_Item ${currentItem === n + 1 ? 'Pagination_Item_Active' : ''}`}>
      {n + 1}
    </li>;
  });
  const onNext = () =>{
    if (currentItem >= total) {
      return;
    }
    if (currentItem + 1 >= total) {
      setDisable([false, true]);
    }
    if (currentItem % section[1] === 0) {
      setSection([section[1], Math.min(total, section[1] + pageSize)]);
    }
    onChange(currentItem + 1, section, pageSize);
    setCurrentItem(currentItem + 1);
  };
  const onPrev = () =>{
    if (currentItem + 1 <= 1) {
      setDisable([true, false]);
    }
    if (currentItem <= 1) {
      return;
    }
    if ((currentItem - 1) % pageSize === 0) {
      setSection([Math.max(0, section[0] - pageSize), Math.max(pageSize, section[1] - pageSize)]);
    }
    onChange(currentItem - 1, section, pageSize);
    setCurrentItem(currentItem - 1);
  };
  paginationItems.push(
    <li className={`Pagination_Item ${disable[1] ? 'Pagination_Item_disable' : ''}`}
      onClick={onNext}
      key={'>'}><Icon type="right" /></li>
  );
  paginationItems.unshift(
    <li className={`Pagination_Item ${disable[0] ? 'Pagination_Item_disable' : ''}`}
      onClick={onPrev}
      key={'<'}><Icon type="left" /></li>
  );
  const onItemClick = (n) => {
    if (n >= total) {
      setDisable([false, true]);
    } else if (n === 1) {
      setDisable([true, false]);
    } else {
      setDisable([false, false]);
    }
    setCurrentItem(n);
    onChange(n, section, pageSize);
  };
  return (
    <div
      className={`Pagination ${className}`}
      style={style}>
      <ul>
        {paginationItems}
      </ul>
    </div>
  );
};