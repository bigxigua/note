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
    if (n.disabled) {
      return;
    }
    onTap(n, i, e);
  };
  const jsx = list.map((n, i) => {
    return (
      <li key={i}
        style={listStyle}
        data-disabled={String(!!n.disabled)}
        onClick={(e) => { onClickHandle(n, i, e); }}
        className={$.trim(`list ${n.checked ? 'list-checked' : ''}`)}>
        {n.icon && <Icon type={n.icon} />}
        <span className="ellipsis">{n.text}</span>
      </li>
    );
  });
  return (
    <ul
      style={style}
      className={`list-wrapper ${className}`}>
      {jsx}
    </ul>
  );
};