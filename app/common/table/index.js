import React from 'react';
import './index.css';

export default function Table(props) {
  const {
    columns = [],
    dataSource = [],
    className = ''
  } = props;
  const colgroup = columns.map(n => {
    return <col key={n.key}
      width={n.width} />;
  });
  const header = columns.map(n => {
    return (
      <th key={n.key}>{n.title}</th>
    );
  });
  const tbody = dataSource.map(n => {
    return (
      <tr key={n.key}>
        {columns.map(k => {
          return <td key={k.key}
            data-a={k.dataIndex}>
            {k.render ? k.render(n[k.key]) : n[k.key]}
          </td>;
        })}
      </tr>
    );
  });
  return (
    <table className={`Table ${className}`}>
      <colgroup>{colgroup}</colgroup>
      <thead>
        <tr className="Table_Header">{header}</tr>
      </thead>
      <tbody className="Table_Tbody">{tbody}</tbody>
    </table>
  );
};