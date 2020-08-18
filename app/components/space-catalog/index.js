import React, { useState, useEffect, useCallback } from 'react';
import { Icon, List } from 'xigua-components/dist/js';
import Popover from '@components/popover';
import { parseUrlQuery, getIn } from '@util/util';
import { extractCatalog, findTargetCatalogPath, createNewDocAction } from '@util/commonFun';
import { CatalogsComponent, addIsOpenProperty } from './handle';
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

/**
  * 当前空间的目录
  * @param {array} docs - 当前空间下的所有文档列表
  * @param {object} spaceInfo - 当前文档所属空间信息
  * @param {boolean} loading -  正在获取空间下的文档列表
*/
export default function SpaceCatalog({
  loading = false,
  spaceInfo = {},
  docs = []
}) {
  const isShare = /\/share\//g.test(window.location.pathname);
  // 移动端和分享页均不显示空间目录
  if (window.isMobile || isShare) {
    return null;
  }
  const { spaceId = '' } = parseUrlQuery();
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  // 正在加载目录
  const [catalogs, setCatalogs] = useState([]);
  const [docLists, setDocLists] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (!Array.isArray(docs) || !docs.length) {
      return;
    }
    const catalog = JSON.parse(getIn(spaceInfo, ['catalog'], '[]'));
    if (catalog.length > 1) {
      const result = extractCatalog(catalog.slice(1));
      const targetPath = findTargetCatalogPath(result, docId);
      setCatalogs(addIsOpenProperty(result, targetPath));
      setDocLists(docs);
    }
  }, [docs, spaceInfo]);

  // 点击章节目录展开or收起子目录
  const onToggleExpandCatalog = useCallback((item, index) => {
    const lists = catalogs.slice(0);
    if (item.level === 0) {
      lists[index].isOpen = !item.isOpen;
      setCatalogs(lists);
    } else {
      const targetPath = findTargetCatalogPath(catalogs, item.docId);
      setCatalogs(addIsOpenProperty(catalogs, targetPath, !item.isOpen, item.docId));
    }
  }, [catalogs]);

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
    // fetchDocsBySpaceId();
  }, [spaceId]);

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
        <CatalogsComponent
          catalogs={catalogs}
          docs={docLists}
          onToggleExpandCatalog={onToggleExpandCatalog}
          loading={loading} />
      </div>
    </nav>
  );
};