import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@common/icon';
import List from '@common/list';
import Popover from '@components/popover';
import axiosInstance from '@util/axiosInstance';
import { parseUrlQuery, getIn } from '@util/util';
import { extractCatalog, findTargetCatalogPath, createNewDocAction } from '@util/commonFun';
import { renderCatalogs, addIsOpenProperty } from './handle';
import { useHistory } from 'react-router-dom';
import './index.css';

const settingList = [{
  text: '管理文档',
  key: 'doc-manage'
}, {
  text: '编排目录',
  key: 'catalog-setting'
}, {
  text: '新建文档',
  key: 'create'
}];

export default function SpaceCatalog() {
  if (window.isMobile) {
    return null;
  }
  const { spaceId = '' } = parseUrlQuery();
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  // 正在加载目录
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState([]);
  const [docLists, setDocLists] = useState([]);
  const history = useHistory();

  // 获取属于同一空间的文档列表
  const fetchDocsBySpaceId = useCallback(async () => {
    setLoading(true);
    const [error, data] = await axiosInstance.get(`space/docs?space_id=${spaceId}`);
    setLoading(false);
    const catalog = JSON.parse(getIn(data, ['space', 'catalog'], '[]'));
    if (catalog.length > 1) {
      const result = extractCatalog(catalog.slice(1));
      const targetPath = findTargetCatalogPath(result, docId);
      setCatalogs(addIsOpenProperty(result, targetPath));
      setDocLists(data.docs);
    } else {
      console.log('[获取space下doc列表失败] ', error);
    }
  }, [docId]);

  // 点击章节目录展开or收起子目录
  const onToggleExpandCatalog = useCallback((data, item, index) => {
    const lists = data.slice(0);
    if (item.level === 0) {
      lists[index].isOpen = !item.isOpen;
      setCatalogs(lists);
    } else {
      const targetPath = findTargetCatalogPath(data, item.docId);
      setCatalogs(addIsOpenProperty(data, targetPath, !item.isOpen, item.docId));
    }
  }, []);

  const onSettingItemClick = useCallback((e, info) => {
    e.stopPropagation();
    const { key } = info;
    if (key === 'doc-manage') {
      history.push(`/spacedetail?spaceId=${spaceId}`);
    } else if (key === 'catalog-setting') {
      history.push(`/spacedetail?spaceId=${spaceId}&type=toc`);
    } else if (key === 'create') {
      createNewDocAction({ space_id: spaceId });
      // 新建完文档跳转编辑页
    }
  }, [spaceId]);

  useEffect(() => {
    fetchDocsBySpaceId();
  }, [spaceId]);

  if (!Array.isArray(catalogs) || !catalogs.length) {
    return null;
  }

  return (
    <nav className="bookcatalog-wrapper">
      <div className="bookcatalog-content">
        <div className="bookcatalog-content__head">
          <h6>目录</h6>
          <div>
            <Popover
              content={<List list={settingList}
                onTap={(info, index, event) => { onSettingItemClick(event, info); }} />}>
              <Icon type="more" />
            </Popover>
          </div>
        </div>
        {renderCatalogs(catalogs, docLists, onToggleExpandCatalog, loading)}
      </div>
    </nav>
  );
};