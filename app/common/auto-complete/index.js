import React, { useCallback, useState, useEffect } from 'react';
import List from '@common/list';
import Dropdown from '@common/dropdown';
import './index.css';

const loop = () => { };

function Overlay({
  options = [],
  onSelect = loop
}) {
  return <List
    className="dropdown-list"
    onTap={onSelect}
    list={options} />;
}
// 是否正在输入中文
let isInputZh = false;

/**
  * Modal弹框
  * @param {string} className - 容器className
  * @param {object} style - 容器style
  * @param {string} placeholder - placeholder
  * @param {Array}  options -  下拉展示的内容
  * @param {boolean}  open -  是否展开下拉内容
  * @param {Function} onSelect - 被选中时调用，参数为选中项的 value 值
  * @param {Function} onChange - 选中 option，或 input 的 value 变化时，调用此函数
  * @param {Function} onFocus - 获得焦点时的回调
  * @param {Function} onBlur - 失去焦点时的回调
  * @param {Function} onDropdownVisibleChange - 展开下拉菜单的回调
*/
export default function AutoComplete({
  className = '',
  style = {},
  placeholder = '',
  options,
  open,
  onSelect = loop,
  onChange = loop,
  onFocus = loop,
  onBlur = loop
}) {
  const [visible, setVisible] = useState(open);

  const onSelected = useCallback((info) => {
    onSelect(info);
  }, []);

  const onInputChange = useCallback((e) => {
    e.persist();
    !isInputZh && onChange(e);
  }, []);

  const onCompositionStart = useCallback(() => {
    isInputZh = true;
  }, []);

  const onCompositionEnd = useCallback((e) => {
    isInputZh = false;
    e.persist();
    onChange(e);
  }, []);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  const prefixCls = $.trim(`autocomplete ${className}`);
  return (
    <div
      className={prefixCls}
      style={style}>
      <Dropdown
        trigger="input"
        className="autocomplete-dropdown"
        visible={visible && options && options.length}
        overlay={<Overlay options={options}
          onSelect={onSelected} />}>
        <input
          className="autocomplete-input"
          type="text"
          placeholder={placeholder}
          autoComplete="off"
          onFocus={onFocus}
          onBlur={onBlur}
          onCompositionEnd={onCompositionEnd}
          onCompositionStart={onCompositionStart}
          onChange={onInputChange}
          spellCheck="true" />
      </Dropdown>
    </div>
  );
};