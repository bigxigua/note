import React from 'react';
import Icon from '@common/icon';
import './index.css';

export default function List(props) {
  const {
    list = [],
    className = '',
    listStyle = {},
    style = {},
    onTap = () => { }
  } = props;
  const onClickHandle = (n, i, e) => {
    onTap(n, i, e);
  };
  const jsx = list.map((n, i) => {
    return (
      <li key={i}
        style={listStyle}
        onClick={(e) => { onClickHandle(n, i, e); }}
        className={`List flex ${n.checked ? 'List_Checked' : ''}`}>
        {n.icon && <Icon type={n.icon} />}
        <span>{n.text}</span>
      </li>
    );
  });
  return (
    <ul
      style={style}
      className={`List_Wrapper ${className}`}>
      {jsx}
    </ul>
  );
};