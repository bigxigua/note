import React, { useState, useEffect, useRef } from 'react';
import { setTextAreaAutoHeight } from '@util/commonFun';
import './index.css';

export default function Input(props) {
  const {
    w = 320, // 宽度
    h = 40, // 高度
    disabled = false, // 是否禁用
    addonBefore, // 前置元素
    addonAfter, // 后置元素
    defaultValue, // 默认value
    defaultFocus = false, // 是否默认focus
    type = 'text',
    autocomplete = 'off',
    placeholder = '',
    maxLength = 100,
    onChange = () => { },
    onFocus = () => { },
    onBlur = () => { },
    className = '',
    style = {},
    rows = '3',
    cols = '20'
  } = props;
  const [value, setValue] = useState(defaultValue);
  const [classes, setClassName] = useState('input-wrapper flex ');
  const textArea = useRef(null);
  const inputRef = useRef(null);

  const _onChange_ = (e) => {
    setValue(e.currentTarget.value);
    onChange(e);
  };

  useEffect(() => {
    let cssName = classes;
    if (!addonBefore && !addonAfter) {
      !/input-full/.test(cssName) && (cssName += 'input-full');
    }
    if (addonBefore && !addonAfter) {
      !/input-before/.test(cssName) && (cssName += 'input-before');
    }
    setClassName(cssName);
  }, [addonBefore, addonAfter]);

  useEffect(() => {
    setValue(defaultValue);
    setTextAreaAutoHeight(textArea.current, 10);
  }, [defaultValue]);

  useEffect(() => {
    if (defaultFocus) {
      setTimeout(() => {
        type === 'textarea' ? textArea.current.focus() : inputRef.current.focus();
      }, 0);
    }
  }, []);

  const disabledCls = disabled ? 'input-disabled' : '';

  return (
    <div className={$.trim(`${classes} ${className} ${disabledCls}`)}
      style={{
        width: isNaN(w) ? w : `${w}px`,
        height: isNaN(h) ? h : `${h}px`,
        ...style
      }}>
      {addonBefore && <span className="input-addon__before flex">{addonBefore}</span>}
      {
        type !== 'textarea' &&
        <input
          ref={inputRef}
          disabled={disabled}
          autoComplete={autocomplete}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value || ''}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={_onChange_} />
      }
      {
        type === 'textarea' &&
        <textarea
          ref={textArea}
          rows={rows}
          cols={cols}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value || ''}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={_onChange_} />
      }
      {addonAfter && <span className="Input_addonAfter">{addonAfter}</span>}
    </div>
  );
};