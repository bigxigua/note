import React, { useEffect, useState, Fragment } from 'react';
import PageLayout from '@layout/page-layout/index';
import TableHeader from '@components/table-header';
import Table from '@common/table';
import Tag from '@common/tag';
import axiosInstance from '@util/axiosInstance';
import { Link } from 'react-router-dom';
import './index.css';

export default function Docs() {
  const [dataSource, setDataSource] = useState(null);
  const columns = [{
    title: '名称',
    key: 'name'
  }, {
    title: '类型',
    key: 'scene',
    render: info => {
      return (
        <div className="Space_Table_Tags flex">
          <Tag>{info.scene}</Tag>
        </div>
      );
    }
  }, {
    title: '简介',
    key: 'description'
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
  const onPaginationChange = () => {};
  return <PageLayout content={
    <Fragment>
      <TableHeader onSomeThingClick={onSomeThingClick} />
      <Table
        dataSourceKey={'id'}
        className="Space_Table"
        columns={columns}
        pagination={{ total: Math.ceil((dataSource || []).length / 10), onChange: onPaginationChange }}
        dataSource={dataSource} />
    </Fragment>
  } />;
};
