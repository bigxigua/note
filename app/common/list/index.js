import React from 'react';
import Icon from '@common/icon';
import './index.css';

export default function List(props) {
  const {
    list = [],
    className = '',
    onTap = console.log
  } = props;
  const onClickHandle = (n, i) => {
    onTap(n, i);
  };
  const jsx = list.map((n, i) => {
    return (
      <li key={i}
        onClick={() => { onClickHandle(n, i); }}
        className={`List flex ${className} ${n.checked ? 'List_Checked' : ''}`}>
        {n.icon && <Icon type={n.icon} />}
        <span>{n.text}</span>
      </li>
    );
  });
  return (
    <ul className="List_Wrapper">
      {jsx}
    </ul>
  );
};