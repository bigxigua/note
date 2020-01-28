import React, { useEffect, useState, Fragment } from 'react';
import PageLayout from '@layout/page-layout/index';
import TableHeader from '@components/table-header';
import Table from '@common/table';
import axiosInstance from '@util/axiosInstance';
import { Link } from 'react-router-dom';
import './index.css';

export default function Docs() {
  const [dataSource, setDataSource] = useState(null);
  const columns = [{
    title: '名称',
    key: 'name',
    render: (info) => {
      return <div>{info.name}</div>;
    }
  },
  {
    title: '简介',
    key: 'description',
    render: (info) => {
      return <div>{info.description}</div>;
    }
  }, {
    title: '操作',
    key: 'action',
    render: (i) => {
      return <Link to={`/spacedetail?spaceId=${i.space_id}`}
        className="Table_Actions">管理</Link>;
    }
  }];
  async function fetchSpaces(q = '') {
    const [error, data] = await axiosInstance.get(`spaces?q=${q}`);
    if (!error && data && Array.isArray(data.spaces) && data.spaces.length > 0) {
      setDataSource(data.spaces);
    } else {
      setDataSource([]);
      console.log('[获取空间列表失败] ', error);
    }
  }
  function onSomeThingClick(type, info) {
    if (type === 'SEARCH_CHANGE') {
      fetchSpaces(info.q);
    }
  }
  useEffect(() => {
    fetchSpaces();
  }, []);
  const onPaginationChange = () => { };
  return <PageLayout
    className="space"
    content={
      <Fragment>
        <TableHeader onSomeThingClick={onSomeThingClick} />
        <Table
          dataSourceKey={'id'}
          className="space-table"
          columns={columns}
          pagination={{ total: Math.ceil((dataSource || []).length / 10), onChange: onPaginationChange }}
          dataSource={dataSource} />
      </Fragment>
    } />;
};
