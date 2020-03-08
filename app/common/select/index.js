import React, { useCallback, useEffect, useState, Fragment, useRef } from 'react';
import ReactDOM from 'react-dom';
import Icon from '@common/icon';
import './index.css';

const fn = () => { };
// 创建select options
function CreateOptions({ options, node, show }) {
  if (!node.current) {
    return null;
  }
  const { width, height, left, top } = node.current.getBoundingClientRect();
  const style = {
    width: `${width}px`,
    left: `${left}px`,
    top: `${top + height}px`
  };
  return ReactDOM.createPortal(
    <div
      className={`select_options animated ${show ? 'select_options_show' : ''}`}
      style={style}>
      {options}
    </div>,
    document.body
  );
}

export default function Select({
  defaultKey = '', // 默认显示的项到key
  defaultOpen = false, // 是否默认展开下拉
  placeholder = '请选择', // 选择框默认文字
  lists = [], // select options
  className = '',
  style = {},
  onSelect = fn
}) {
  const node = useRef(null);
  const [open, setOpen] = useState(defaultOpen);
  const [currentKey, setCurrentKey] = useState(defaultKey);

  useEffect(() => {
    setCurrentKey(defaultKey);
  }, [defaultKey]);

  const options = lists.map(n => {
    return <div
      onClick={(e) => { onOptionClick(e, n); }}
      key={n.id}
      className={`select_option ${n.id === currentKey ? 'select_option_selected' : ''}`}>
      {n.render ? n.render(n) : n.text}
    </div>;
  });

  const onOptionClick = useCallback((e, item) => {
    setCurrentKey(item.id);
    setOpen(false);
    onSelect(e, item);
  }, []);

  // 点击展开/收起下拉
  const onShowSelectOption = useCallback(() => {
    setOpen(!open);
  }, [open]);

  // 选择框的value
  const { text = '' } = (lists.find(n => n.id === currentKey) || {});

  return <Fragment>
    <div
      className={`Select flex ${className}`}
      style={style}
      ref={node}
      onClick={onShowSelectOption}>
      <span className={!text ? 'select_placeholder' : ''}>{text || placeholder}</span>
      <Icon className="select_arrow"
        type="right" />
    </div>
    <CreateOptions
      node={node}
      show={open}
      options={options} />
  </Fragment>;
};