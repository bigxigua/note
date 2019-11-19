import React, { useEffect, useState } from 'react';
import Header from '@components/header/header';
import SiderBarLayout from '@components/sider-bar/index';
import TableHeader from '@components/table-header';
import Footer from '@components/footer';
import Table from '@common/table';
import axiosInstance from '@util/axiosInstance';
import { Link } from 'react-router-dom';
import './index.css';

export default function Space() {
  const [dataSource, setDataSource] = useState([]);
  const columns = [{
    title: '名称',
    key: 'title',
    dataIndex: 'title'
  }, {
    title: '状态',
    key: 'status',
    dataIndex: 'status'
  }, {
    title: '归属',
    key: 'space',
    dataIndex: 'space',
    render: space => space.name
  }, {
    title: '最后编辑',
    key: 'updated_at',
    dataIndex: 'updated_at'
  }, {
    title: '编辑',
    key: 'url',
    dataIndex: 'url',
    render: url => {
      return <Link to={'/editor' + url.split('article')[1]}>编辑</Link>;
    }
  }];
  async function fetchDocs(type = 'ALL', q = '') {
    const [error, data] = await axiosInstance.get(`docs?q=${q}&type=${type.toLocaleLowerCase()}`);
    if (!error && data && Array.isArray(data) && data.length > 0) {
      setDataSource(data);
    } else {
      console.log('[获取文档列表失败] ', error);
    }
  }
  function onTypeChange(type, info) {
    console.log(type, info);
    // 切换最近编辑/我创建的
    if (type === 'TYPE_CHANGE') {
      fetchDocs(info.code);
    }
    // 搜索
    if (type === 'SEARCH_CHANGE') {
      fetchDocs(info.code, info.q);
    }
  }
  useEffect(() => {
    fetchDocs();
  }, []);
  return (
    <div className="Container">
      <Header />
      <div className="Content_Wrapper_Index">
        <SiderBarLayout />
        <div className="Space_Content">
          <TableHeader onSomeThingClick={onTypeChange} />
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