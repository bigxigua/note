import React, { useState, useEffect } from 'react';
// import Icon from '../icon/icon.js';
import './index.css';

export default function Input(props) {
  const {
    addonBefore,
    addonAfter,
    defaultValue,
    type = 'text',
    autocomplete = 'off',
    placeholder = '',
    maxLength = 100,
    onChange = console.log
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
  return (
    <div className={className}>
      {addonBefore && <span className="Input_addonBefore flex">{addonBefore}</span>}
      <input
        autoComplete={autocomplete}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value || ''}
        onChange={_onChange_}
      >
      </input>
      {addonAfter && <span className="Input_addonAfter">{addonAfter}</span>}
    </div>
  );
};