import React, { useCallback, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Popover from '@components/popover';
import useMessage from '@hooks/use-message';
import axiosInstance from '@util/axiosInstance';
import { Icon, List, Modal, Empty } from 'xigua-components/dist/js';
import DocItem from '@components/doc-item';
import { getIn } from '@util/util';
import { logicalDeletion, physicalDeletion, setDocToTemplate } from '@util/commonFun';
import { addToShortcutEntry } from '@util/commonFun2';

// 下拉选项
export function DocOperation({ docInfo, deleteDoc, update }) {
  const { is_template } = docInfo;
  const history = useHistory();

  // popover弹出项点击
  const onOperationClick = useCallback(async ({ key, docInfo }) => {
    const { title, url, doc_id, space_id } = docInfo;
    if (key === 'delete') {
      // 删除
      Modal.confirm({
        title: '确认移除该文档吗？QAQ',
        subTitle: '删除后，会在回收站内保存30天，30天后会被物理删除',
        onOk: () => {
          deleteDoc({ currentTarget: { getAttribute: () => 'FAKE_DOC_DELETE' } });
        }
      });
    } else if (key === 'editor') {
      // 编辑
      history.push(`/simditor/${doc_id}?spaceId=${space_id}`);
    } else if (key === 'template') {
      // 设置为模版
      const [, data] = await setDocToTemplate({ docId: doc_id });
      if (getIn(data, ['templateId'])) {
        update('SET_TO_TEMPLATE', doc_id);
      }
    } else if (key === 'addindex') {
      // 添加至快捷入口
      addToShortcutEntry({ title, url, type: 'XIGUA_DOC', signId: doc_id });
    }
  }, [docInfo]);

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
        disabled: is_template === '1',
        docInfo
      }, {
        text: '添加到快捷入口',
        key: 'addindex',
        docInfo
      }
      ]} />);
}

// 更多操作
export function MoreActions({ docInfo, updateDataSource, dataSource }) {
  const {
    status,
    title,
    title_draft,
    html_draft,
    doc_id,
    space_id,
    url
  } = docInfo || {};
  const history = useHistory();
  const message = useMessage();

  // 恢复文档
  const onRecovery = useCallback(async () => {
    const [error, data] = await axiosInstance.post('/doc/update', {
      status: '1',
      doc_id,
      space_id
    });
    if (!error && data && data.STATUS === 'OK') {
      history.push(`/article/${doc_id}?spaceId=${space_id}`);
    } else {
      message.error({ content: '系统开小差啦，请稍后再试' });
    }
  }, [dataSource]);

  // 删除文档（伪删除）
  const onDeleteDoc = useCallback(async (e) => {
    const type = e.currentTarget.getAttribute('data-type');
    const isPhysicalDelete = type === 'THOROUGH_DOC_DELETE';
    const method = isPhysicalDelete ? physicalDeletion : logicalDeletion;
    const success = await method({ docId: doc_id, spaceId: space_id });
    if (success) {
      updateDataSource(type, doc_id);
    } else {
      message.error({ content: '系统开小差啦，请稍后重试' });
    }
  }, [dataSource]);

  if (status === '0') {
    return (<div className="doc-action">
      <span
        onClick={onRecovery}
        style={{ color: 'rgb(37, 184, 100)', marginRight: '10px' }}>恢复</span>
      <span data-type="THOROUGH_DOC_DELETE"
        onClick={onDeleteDoc}>彻底删除</span>
    </div>);
  }
  if (title_draft || html_draft) {
    return <Link className="table-actions"
      to={`/simditor/${doc_id}?spaceId=${space_id}&action=update`}>去更新</Link>;
  }
  return (
    <div
      className="flex"
      style={{ width: '100px' }}>
      <Link className="table-actions"
        to={'/article' + url.split('article')[1]}>查看</Link>
      <Popover content={< DocOperation deleteDoc={onDeleteDoc}
        docInfo={docInfo}
        update={updateDataSource} />}>
        <Icon type="ellipsis"
          className="Space_Operation_Icon table-actions" />
      </Popover>
    </div>);
}

/**
* 移动端文档列表
* @param {array} dataSource - 文档列表
* @param {boolean} loading - 正在获取文档列表
*/
export function DoclistsForMobile({ dataSource = [], loading }) {
  if (!window.isMobile) {
    return null;
  }
  if (loading) {
    return <Icon
      className="docs_m_loading"
      type="loading" />;
  }
  if (!dataSource || dataSource.length === 0) {
    return <Empty image="/images/undraw_empty.svg"
      description="暂无文档" />;
  }
  return dataSource.map((item, index) => {
    return <DocItem
      docInfo={item}
      key={`${item.doc_id}_${index}`} />;
  });
}