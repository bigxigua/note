import React, { useEffect, useCallback } from 'react';
import { useImmer } from 'use-immer';
import PageLayout from '@layout/page-layout/index';
import TableHeader from '@components/table-header';
import { Table, Tag } from 'xigua-components/dist/js';
import axiosInstance from '@util/axiosInstance';
import { Link } from 'react-router-dom';
import { MoreActions, DoclistsForMobile } from './components';
import { formatTimeStamp, checkBrowser, getIn } from '@util/util';
import './index.css';

const { isMobile } = checkBrowser();

export default function Docs() {
  const [state, setState] = useImmer({
    loading: false, // 正在获取
    total: 0, // 总页数
    pageNo: 1, // 当前页码
    searchContent: '', // 搜索条件
    queryType: 'ALL', // 查询类型
    dataSource: null // 文档列表
  });
  const { loading, total, pageNo, searchContent, queryType, dataSource } = state;
  // 列表数据发生更改
  const onDataSourceUpdate = useCallback((type, docId) => {
    let data = [...dataSource];
    const index = data.findIndex(n => n.doc_id === docId);
    if (type === 'FAKE_DOC_DELETE') {
      data = data.map((n, i) => { return { ...n, status: i === index ? '0' : n.status }; });
    } else if (type === 'THOROUGH_DOC_DELETE') {
      data.splice(index, 1);
    } else if (type === 'SET_TO_TEMPLATE') {
      data[index].is_template = '1';
      data = data.map((n, i) => { return { ...n, is_template: i === index ? '1' : n.is_template }; });
    }
    setState(draft => {
      draft.dataSource = data;
    });
  }, [dataSource]);

  const columns = [{
    title: '名称',
    key: 'title',
    render: (info) => {
      return <Link
        className="docs_name"
        to={'/article' + info.url.split('article')[1]}>{info.title}</Link>;
    }
  }, {
    title: '状态',
    key: 'status',
    render: (info) => {
      const { status, html_draft, title_draft, is_template, is_share } = info;
      return (
        <div className="docs-tags">
          {is_template === '1' && <Tag color="#f50">模版</Tag>}
          {is_share === '1' && <Tag color="rgb(37, 184, 100)">分享中</Tag>}
          {status === '0' && <Tag color="rgb(255, 85, 0)">已删除</Tag>}
          {(html_draft || title_draft) && <Tag>未更新</Tag>}
        </div>
      );
    }
  }, {
    title: '归属',
    key: 'space',
    render: (info) => {
      return <div>{info.space && info.space.name}</div>;
    }
  }, {
    title: '最后编辑',
    key: 'updated_at',
    render: (info) => {
      return <div style={{ width: '156px' }}>{formatTimeStamp(info.updated_at)}</div>;
    }
  }, {
    title: '更多操作',
    key: 'url',
    render: (info) => {
      return <MoreActions
        docInfo={info}
        dataSource={dataSource}
        updateDataSource={onDataSourceUpdate} />;
    }
  }];

  // 获取文档列表
  const fetchDocs = useCallback(async () => {
    setState(draft => {
      draft.loading = true;
    });
    const [, data] = await axiosInstance.get(`docs?q=${encodeURIComponent(searchContent)}&type=${queryType}&pageNo=${pageNo}`);
    const docs = getIn(data, ['docs'], []);
    const total = getIn(data, ['total']);
    setState(draft => {
      draft.dataSource = Array.isArray(docs) ? docs : [];
      draft.total = total;
      draft.loading = false;
    });
  }, [pageNo, searchContent, queryType]);

  // 切换文档类型或者搜索时
  const onTypeChange = useCallback((type, { code, q }) => {
    // 切换文档类型
    if (type === 'TYPE_CHANGE') {
      setState(draft => {
        draft.pageNo = 1;
        draft.queryType = code;
        draft.searchContent = q;
      });
    }
    // 搜索
    if (type === 'SEARCH_CHANGE') {
      setState(draft => {
        draft.pageNo = 1;
        draft.searchContent = q;
      });
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [pageNo, searchContent, queryType]);

  const onPaginationChange = useCallback((page) => {
    setState(draft => {
      draft.pageNo = page;
    });
  }, [state.pageNo]);

  return <PageLayout
    className="docs"
    content={
      <>
        <TableHeader onSomeThingClick={onTypeChange} />
        <DoclistsForMobile dataSource={dataSource}
          loading={loading} />
        {!isMobile && <Table
          dataSourceKey={'id'}
          className="space-table"
          columns={columns}
          pagination={{ total: Math.ceil(total / 10), onChange: onPaginationChange }}
          dataSource={dataSource} />}
      </>
    } />;
}