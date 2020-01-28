import React from 'react';
import Empty from '@common/empty';
import Pagination from '@common/pagination';
import Icon from '@common/icon';
// import Loading from '@common/loading';
import './index.css';

/**
* @description Table表格组件，渲染表格，默认有loading/empty状态
* @props {columns} Array 表格列的配置
* @props {dataSource} Array 数据数组, 表格loading状态对应dataSource为非数组，表格empty状态对应dataSource.length为0
* @props {dataSourceKey} String 数据数组不可重复的key
* @props {pagination} ReactComponent 分页器, 参考Pagination组件
* @props {emptyJsx} ReactComponent 自定义空样式元素
* @props {className} String 表格元素自定义类名
* @return {Num} result 结果
*/
export default function Table(props) {
  const {
    columns = [],
    dataSource,
    className = '',
    emptyJsx = null,
    dataSourceKey = 'key',
    pagination
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
  if (!Array.isArray(dataSource)) {
    return <div className="Table_loading">
      <Icon type="loading" />
    </div>;
  }
  if (dataSource.length === 0) {
    return emptyJsx || <Empty style={{ borderTop: 'none' }} />;
  }
  const tbody = dataSource.map(n => {
    return (
      <tr key={n[dataSourceKey]}>
        {columns.map(k => {
          return <td key={k.key}>
            {k.render ? k.render(n) : n[k.key]}
          </td>;
        })}
      </tr>
    );
  });
  return (
    <div>
      <table className={`table ${className}`}>
        <colgroup>{colgroup}</colgroup>
        <thead>
          <tr className="table-header">{header}</tr>
        </thead>
        <tbody className="table-tbody">{tbody}</tbody>
      </table>
      {pagination && <Pagination {...pagination} />}
    </div>
  );
};