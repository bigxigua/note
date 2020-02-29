import React, { useEffect, useState, Fragment, useCallback } from 'react';
import PageLayout from '@layout/page-layout/index';
import TableHeader from '@components/table-header';
import Popover from '@components/popover';
import DocItem from '@components/doc-item';
import Table from '@common/table';
import Tag from '@common/tag';
import List from '@common/list';
import Icon from '@common/icon';
import Modal from '@common/modal';
import useMessage from '@hooks/use-message';
import axiosInstance from '@util/axiosInstance';
import { Link, useHistory } from 'react-router-dom';
import { formatTimeStamp, checkBrowser } from '@util/util';
import { addRecent, logicalDeletion, physicalDeletion, setDocToTemplate } from '@util/commonFun';
import './index.css';

const message = useMessage();
const { isMobile } = checkBrowser();

// 下拉选项
function renderDocOperation(onOperationClick, docInfo) {
  return (
    <List className="docs_operations"
      onTap={onOperationClick}
      list={[{
        text: '编辑',
        key: 'editor',
        docInfo
      }, {
        text: '删除',
        key: 'delete',
        docInfo
      }, {
        text: '设置为模版',
        key: 'template',
        docInfo
      }
      ]} />);
}
// 恢复文档
async function onRecovery(info, history) {
  const { doc_id, space: { space_id } } = info;
  const [error, data] = await axiosInstance.post('/doc/update', {
    status: '1',
    doc_id,
    space_id
  });
  if (!error && data && data.STATUS === 'OK') {
    history.push(`/article/${doc_id}?spaceId=${space_id}`);
  } else {
    message.error({ content: '系统开小差啦，请稍后再试' });
    console.log('[恢复文档失败] ', error);
  }
}
// 右侧操作项
function renderRightJsx(info, handle, h, deleteDoc) {
  if (info.status === '0') {
    return (<div className="doc-action">
      <span
        onClick={() => { onRecovery(info, h); }}
        style={{ color: 'rgb(37, 184, 100)', marginRight: '10px' }}>恢复</span>
      <span onClick={() => { deleteDoc('thorough', info); }}>彻底删除</span>
    </div>);
  }
  if (info.title_draft || info.markdown_draft) {
    return <Link className="table-actions"
      to={`/simditor/${info.doc_id}?spaceId=${info.space_id}`}>更新</Link>;
  }
  return (
    <div
      className="flex"
      style={{ width: '100px' }}>
      <Link className="table-actions"
        to={'/article' + info.url.split('article')[1]}>查看</Link>
      <Popover content={renderDocOperation(handle, info)}>
        <Icon type="ellipsis"
          className="Space_Operation_Icon table-actions" />
      </Popover>
    </div>);
}

// 移动端显示到文档列表
function renderDoclistsForMobile(lists = [], loading) {
  if (!isMobile) {
    return null;
  }
  if (loading) {
    return <Icon
      className="docs_m_loading"
      type="loading" />;
  }
  if (!lists || lists.length === 0) {
    return <span className="docs_m_empty">暂无数据</span>;
  }
  return lists.map(item => {
    return <DocItem
      docInfo={item}
      key={item.doc_id} />;
  });
}

export default function Space() {
  const [dataSource, setDataSource] = useState(null);
  // 分页参数
  const [pageNo, setPageNo] = useState(1);
  // 正在请求接口
  const [loading, setLoading] = useState(false);
  const history = useHistory();
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
      if (info.status === '0') {
        return <Tag color="rgb(255, 85, 0)">已删除</Tag>;
      }
      if (!info.markdown_draft && !info.title_draft) {
        return <Tag color="#25b864">已更新</Tag>;
      }
      return <Tag>未更新</Tag>;
    }
  }, {
    title: '归属',
    key: 'space',
    render: (info) => {
      return <div>{info.space && info.space.name}</div>; ;
    }
  }, {
    title: '最后编辑',
    key: 'updated_at',
    render: (info) => {
      return <div style={{ width: '156px' }}>{formatTimeStamp(info.updated_at)}</div>;
    }
  }, {
    title: '编辑',
    key: 'url',
    render: (info) => {
      return renderRightJsx(info, onOperationClick, history, deleteDoc);
    }
  }];

  // 获取文档列表
  const fetchDocs = useCallback(async ({ type = 'ALL', q = '', page = '' } = {}) => {
    setLoading(true);
    const [error, data] = await axiosInstance.get(`docs?q=${encodeURIComponent(q)}&type=${type.toLocaleLowerCase()}${page}`);
    setLoading(false);
    if (!error && data && Array.isArray(data) && data.length > 0) {
      setDataSource(data);
    } else {
      setDataSource([]);
    }
  }, []);

  // 删除文档
  async function deleteDoc(type = '', info) {
    const { doc_id: docId, space_id: spaceId, title } = info;
    const isPhysicalDelete = type === 'thorough';
    const method = isPhysicalDelete ? physicalDeletion : logicalDeletion;
    const success = await method({ docId, spaceId });
    if (success) {
      setDataSource(dataSource.map(n => {
        if (n.doc_id === docId) {
          isPhysicalDelete ? (n = null) : (n.status = '0');
        }
        return n;
      }).filter(n => n));
      await addRecent({
        docId,
        spaceId,
        docTitle: title,
        type: isPhysicalDelete ? 'PhysicalDeleteEdit' : 'LogicalDeleteEdit'
      });
    } else {
      message.error({ content: '系统开小差啦，请稍后重试' });
    }
  }

  const onOperationClick = useCallback(({ key, docInfo }) => {
    const { html, title, url, doc_id, space_id } = docInfo;
    if (key === 'delete') {
      Modal.confirm({
        title: '确认移除该文档吗？QAQ',
        subTitle: '删除后，会在回收站内保存30天，30天后会被物理删除',
        onOk: async () => {
          deleteDoc('', docInfo);
        }
      });
    } else if (key === 'editor') {
      history.push(`/simditor/${doc_id}?spaceId=${space_id}`);
    } else if (key === 'template') {
      setDocToTemplate({ html, title, url });
    }
  }, [dataSource]);

  const onTypeChange = useCallback((type, { code, q }) => {
    // 切换最近编辑/我创建的
    if (type === 'TYPE_CHANGE') {
      fetchDocs({ type: code });
    }
    // 搜索
    if (type === 'SEARCH_CHANGE') {
      fetchDocs({ type: code, q });
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, []);

  const pagingDataSource = () => {
    if (!Array.isArray(dataSource)) {
      return null;
    }
    return dataSource.slice((pageNo - 1) * 10, 10 + (pageNo - 1) * 10);
  };

  const onPaginationChange = useCallback((page) => {
    setPageNo(page);
  }, []);

  return <PageLayout
    className="docs"
    content={
      <Fragment>
        <TableHeader onSomeThingClick={onTypeChange} />
        {renderDoclistsForMobile(dataSource, loading)}
        {!isMobile && <Table
          dataSourceKey={'id'}
          className="space-table"
          columns={columns}
          pagination={{ total: Math.ceil((dataSource || []).length / 10), onChange: onPaginationChange }}
          dataSource={pagingDataSource()} />}
      </Fragment>
    } />;
}