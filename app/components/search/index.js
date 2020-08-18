import React, { useEffect, useCallback, useRef } from 'react';
import { Icon } from 'xigua-components/dist/js';
import { addEventListener } from '@util/util';
import './index.css';

/**
* @description 搜索组件
* @props {placeholder} String input placeholder
* @props {className} String 表格元素自定义类名
* @props {onChange} Function input内容发生改变时回调 onChange(e)
* @props {onEnter} Function input监听到键盘enter事件后触发  onEnter(input.current.value);
*/
export default function Search({
  className = '',
  placeholder = '搜索试试',
  onChange = () => { },
  onEnter = () => { }
}) {
  const input = useRef(null);

  useEffect(() => {
    const handle = addEventListener(input.current, 'keyup', (e) => {
      +e.keyCode === 13 && onEnter(input.current.value);
    });
    return () => {
      handle();
    };
  }, []);

  const onInputChange = useCallback((e) => {
    onChange(e);
  }, []);

  return (
    <div className={$.trim(`search ${className}`)}>
      <Icon type="search" />
      <input type="text"
        ref={input}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="true"
        onChange={onInputChange}
        className="search-input" />
    </div>
  );
}