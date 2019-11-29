import React, { useState, useEffect } from 'react';
import './index.less';
import Table from '@common/table';
import TableHeader from '@components/table-header';
import axiosInstance from '@util/axiosInstance';

const columns = [{
  title: '名称',
  key: 'name'
}, {
  title: '类型',
  key: 'scene'
}, {
  title: '简介',
  key: 'description'
}, {
  title: '操作',
  key: 'action',
  render: () => {
    return '管理';
  }
}];

export default function Index() {
  const [dataSource, setDataSource] = useState([]);
  const fetchStarList = async () =>{
    const [error, data] = await axiosInstance.get('stars');
    if (!error && data && Array.isArray(data) && data.length > 0) {
      setDataSource(data);
    } else {
      console.log('[获取文档列表失败] ', error);
    }
  };

  useEffect(() => {
    fetchStarList();
  }, []);
  return (
    <div >
      <TableHeader />
      <Table
        dataSourceKey={'id'}
        className="Stars_Table"
        columns={columns}
        dataSource={dataSource} />
    </div>
  );
}