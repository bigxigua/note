import React, { useState, useEffect } from 'react';
import './index.css';

export default function Input(props) {
  const {
    w = 320, // 宽度
    h = 40, // 高度
    addonBefore, // 前置元素
    addonAfter, // 后置元素
    defaultValue, // 默认value
    type = 'text',
    autocomplete = 'off',
    placeholder = '',
    maxLength = 100,
    onChange = console.log,
    className: classN,
    rows = '3',
    cols = '20'
  } = props;
  const [value, setValue] = useState(defaultValue);
  const [className, setClassName] = useState('Input_Wrapper flex ');
  const _onChange_ = (e) => {
    setValue(e.currentTarget.value);
    onChange(e);
  };
  useEffect(() => {
    let cssName = className;
    if (!addonBefore && !addonAfter) {
      cssName += 'Input_Full';
    }
    if (addonBefore && !addonAfter) {
      cssName += 'Input_Before';
    }
    setClassName(cssName);
  }, [addonBefore, addonAfter]);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  return (
    <div className={`${className} ${classN}`}
      style={{
        width: isNaN(w) ? w : `${w}px`,
        height: isNaN(h) ? h : `${h}px`
      }}>
      {addonBefore && <span className="Input_addonBefore flex">{addonBefore}</span>}
      {
        type !== 'textarea' &&
        <input
          autoComplete={autocomplete}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value || ''}
          onChange={_onChange_} />
      }
      {
        type === 'textarea' &&
          <textarea
            rows={rows}
            cols={cols}
            placeholder={placeholder}
            maxLength={maxLength}
            value={value || ''}
            onChange={_onChange_} />
      }
      {addonAfter && <span className="Input_addonAfter">{addonAfter}</span>}
    </div>
  );
};