import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Icon from '@common/icon';
import './index.css';

const list = [{
  text: '移除记录',
  key: 'remove',
  icon: 'delete'
}];
const fn = () => { };

export default function Select({
  defaultValue = '', // 默认显示的值
  defaultOpen = false, // 是否默认展开下拉
  placeholder = '', // 选择框默认文字
  lists = [], // select options
  key = 'id', // select options key
  className = '',
  style = {},
  onBlur = fn,
  onSelect = fn
}) {
  useEffect(() => {
  }, []);
  const options = lists.map(n => {
    return <div key={n[key]}
      className="select_option">
      {n.render ? n.render(n) : n.text}
    </div>;
  });
  console.log('------');
  const render = () => {
    const JSXdom =
      <div className="Select flex">
        <span>哈哈哈</span>
        <Icon className="select_arrow"
          type="right" />
        <div className="select_options">
          {options}
        </div>
      </div>;
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    ReactDOM.render(JSXdom, dom);
  };
  render();
  return null;
};