import React, { useEffect, useState, Fragment, useCallback } from 'react';
import PageLayout from '@layout/page-layout/index';
import TableHeader from '@components/table-header';
import axiosInstance from '@util/axiosInstance';
import { Table, List, Icon, Popover } from 'xigua-components/dist/js';
import { Link } from 'react-router-dom';
import { addToShortcutEntry } from '@util/commonFun2';
import './index.css';

const settingList = [{
  text: '添加到快捷入口',
  key: 'addindex'
}];

export default function Docs() {
  const [dataSource, setDataSource] = useState(null);
  const [total, setTotal] = useState(0);

  const onSettingItemClick = useCallback((info, spaceInfo) => {
    const { name, space_id: spaceId } = spaceInfo;
    if (info.key === 'addindex') {
      addToShortcutEntry({
        title: name,
        signId: spaceId,
        url: `${window.location.origin}/spacedetail?spaceId=${spaceId}`,
        type: 'XIGUA_SPACE'
      });
    }
  }, []);

  const columns = [{
    title: '名称',
    key: 'name',
    render: (info) => {
      return <Link to={`/spacedetail?spaceId=${info.space_id}`}>{info.name}</Link>;
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
      return (<div className="space-action">
        <Link to={`/spacedetail?spaceId=${i.space_id}`}
          className="table-actions">管理</Link>
        <Popover
          content={<List list={settingList}
            onTap={(info) => { onSettingItemClick(info, i); }} />}>
          <Icon type="ellipsis" />
        </Popover>
      </div>);
    }
  }];

  const fetchSpaces = useCallback(async (q = '') => {
    const [error, data] = await axiosInstance.get(`spaces?q=${q}`);
    if (!error && data && Array.isArray(data.spaces) && data.spaces.length > 0) {
      setDataSource(data.spaces);
      setTotal(data.total);
    } else {
      setDataSource([]);
      console.log('[获取空间列表失败] ', error);
    }
  }, []);

  const onSomeThingClick = useCallback((type, info) => {
    if (type === 'SEARCH_CHANGE') {
      fetchSpaces(info.q);
    }
  }, []);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const onPaginationChange = useCallback((a, b, c) => {
    console.log(a, b, c);
  }, []);
  return <PageLayout
    className="space"
    content={
      <Fragment>
        <TableHeader onSomeThingClick={onSomeThingClick} />
        <Table
          dataSourceKey={'id'}
          className="space-table"
          columns={columns}
          pagination={{
            total: Math.ceil(total / 10),
            onChange: onPaginationChange
          }}
          dataSource={dataSource} />
      </Fragment>
    } />;
};
