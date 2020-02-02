import React, { useState, useEffect, useCallback, useRef } from 'react';
// import CatalogSkeleton from '@components/catalog-skeleton';
import axiosInstance from '@util/axiosInstance';
import { parseUrlQuery, getIn } from '@util/util';
import { extractCatalog, findTargetCatalogPath } from '@util/commonFun';
import { renderCatalogs, addIsOpenProperty } from './handle';
import './index.css';

export default function BookCatalog() {
  const { spaceId = '' } = parseUrlQuery();
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  // const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState([]);
  const [docLists, setDocLists] = useState([]);
  const loading = useRef(false);

  // 获取属于同一空间的文档列表
  const fetchDocsBySpaceId = useCallback(async () => {
    loading.current = true;
    const [error, data] = await axiosInstance.get(`space/docs?space_id=${spaceId}`);
    loading.current = false;
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

  useEffect(() => {
    fetchDocsBySpaceId();
  }, [spaceId]);

  if (loading.current) {
    return <div className="bookcatalog-wrapper"></div>;
    // return <div className="bookcatalog-wrapper"><CatalogSkeleton /></div>;
  }

  const bookCatalogJsx = renderCatalogs(catalogs, docLists, onToggleExpandCatalog);

  return (
    <nav className="bookcatalog-wrapper">
      <div className="bookcatalog-content">
        {bookCatalogJsx}
      </div>
    </nav>
  );
};