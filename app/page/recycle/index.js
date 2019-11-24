import React, { useEffect, useState } from 'react';
import Header from '@components/header/header';
import SiderBarLayout from '@components/sider-bar/index';
import TableHeader from '@components/table-header';
import Footer from '@components/footer';
import Popover from '@components/popover';
import Table from '@common/table';
import Empty from '@common/empty';
import Tag from '@common/tag';
import List from '@common/list';
import Icon from '@common/icon';
import Modal from '@common/modal';
import axiosInstance from '@util/axiosInstance';
import { Link } from 'react-router-dom';
import { formatTimeStamp } from '@util/util';
import './index.css';

function renderOperation(onOperationClick, docInfo) {
  return (
    <List className="Docs_operations"
      onTap={onOperationClick}
      list={[{
        text: '删除',
        key: 'delete',
        docInfo
      }, {
        text: '复制',
        key: 'copy',
        docInfo
      }, {
        text: '使用该模版创建',
        key: 'template',
        docInfo
      }]} />);
}
export default function Recycle() {
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [docInfo, setDocInfo] = useState(false);
  const columns = [{
    title: '名称',
    key: 'title'
  }, {
    title: '归属',
    key: 'space',
    render: (info) => info.space.name
  }, {
    title: '删除时间',
    key: 'updated_at',
    render: (info) => {
      return formatTimeStamp(info.updated_at);
    }
  }, {
    title: '编辑',
    key: 'url',
    dataIndex: 'CUSTOM',
    render: ({ url, ...a }) => {
      return <div className="flex">
        <span>恢复</span>
        <span>彻底删除</span>
      </div>;
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
  async function deleteDoc() {
    const docId = docInfo.doc_id;
    const [error, data] = await axiosInstance.post('/doc/update', {
      status: '0',
      doc_id: docId
    });
    if (!error && data && data.STATUS === 'OK') {
      setDataSource(dataSource.map(n => {
        if (n.doc_id === docId) {
          n.status = '0';
        }
        return n;
      }));
    } else {
      console.log('[获取文档列表失败] ', error);
    }
  }
  function onOperationClick(e) {
    const { key, docInfo } = e;
    if (key === 'delete') {
      setVisible(true);
      setDocInfo(docInfo);
    }
  }
  function onTypeChange(type, info) {
    // 切换最近编辑/我创建的
    if (type === 'TYPE_CHANGE') {
      fetchDocs(info.code);
    }
    // 搜索
    if (type === 'SEARCH_CHANGE') {
      fetchDocs(info.code, info.q);
    }
  }
  function filterDataSource(d) {
    return d.filter(n => n.status !== '0');
  }
  useEffect(() => {
    fetchDocs();
  }, []);
  const onCancelModal = () => {
    setVisible(false);
  };
  const onConfirmModal = () => {
    deleteDoc();
    setVisible(false);
  };
  return (
    <div className="Container">
      <Header />
      <div className="Content_Wrapper_Index">
        <SiderBarLayout />
        <div className="Space_Content">
          <TableHeader onSomeThingClick={onTypeChange} />
          {dataSource.length === 0
            ? < Empty style={{ borderTop: 'none' }} />
            : <Table
              dataSourceKey={'id'}
              className="Space_Table"
              columns={columns}
              dataSource={filterDataSource(dataSource)} />}
        </div>
      </div>
      <Footer />
      <Modal
        subTitle="确认移动该文档到回收站？"
        title="移到回收站"
        onCancel={onCancelModal}
        onConfirm={onConfirmModal}
        confirmText="确认删除"
        visible={visible} >
        移动到回收站后，可在左下角【回收站】进行恢复
      </Modal>
    </div>
  );
}