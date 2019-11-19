import React, { useEffect, useState } from 'react';
import Header from '@components/header/header';
import SiderBarLayout from '@components/sider-bar/index';
import TableHeader from '@components/table-header';
import Footer from '@components/footer';
import Table from '@common/table';
import Tag from '@common/tag';
import Button from '@common/button';
import axiosInstance from '@util/axiosInstance';
import './index.css';

export default function Docs() {
  const [dataSource, setDataSource] = useState([]);
  const columns = [{
    title: '名称',
    key: 'name',
    dataIndex: 'name',
    render: text => <a>{text}</a>
  }, {
    title: '类型',
    key: 'scene',
    dataIndex: 'scene',
    render: text => {
      return (
        <div className="Space_Table_Tags flex">
          <Tag>{text}</Tag>
        </div>
      );
    }
  }, {
    title: '简介',
    key: 'description',
    dataIndex: 'description',
    render: text => <a>{text}</a>
  }, {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    render: () => {
      return <Button>管理</Button>;
    }
  }];
  async function fetchSpaces (q = '') {
    const [error, data] = await axiosInstance.get(`spaces?q=${q}`);
    if (!error && data && Array.isArray(data.spaces) && data.spaces.length > 0) {
      setDataSource(data.spaces);
    } else {
      setDataSource([]);
      console.log('[获取空间列表失败] ', error);
    }
  }
  function onSomeThingClick (type, info) {
    if (type === 'SEARCH_CHANGE') {
      fetchSpaces(info.q);
    }
  }
  useEffect(() => {
    fetchSpaces();
  }, []);
  return (
    <div className="Container">
      <Header />
      <div className="Content_Wrapper_Index">
        <SiderBarLayout />
        <div className="Space_Content">
          <TableHeader onSomeThingClick={onSomeThingClick} />
          <Table
            dataSourceKey={'id'}
            className="Space_Table"
            columns={columns}
            dataSource={dataSource} />
        </div>
      </div>
      <Footer />
    </div>
  );
}