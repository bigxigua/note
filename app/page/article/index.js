import React, { useEffect, useState } from 'react';
import ArticleHeader from '@components/header-article';
import Article from '@components/article';
import axiosInstance from '@util/axiosInstance';
import './index.css';

export default function Index() {
  const [docInfo, setDocInfo] = useState(undefined);
  async function fetchDocDetail() {
    const docId = window.location.pathname.split('/').filter(n => n)[1];
    const [error, data] = await axiosInstance.get(`docs?docId=${docId}&type=detail`);
    if (error || !Array.isArray(data) || data.length === 0) {
      console.log('[获取文档信息失败]', error, data);
      return;
    }
    setDocInfo(data[0]);
  }
  useEffect(() => {
    fetchDocDetail();
  }, []);
  return (
    <div className="Container">
      <ArticleHeader docInfo={docInfo} />
      <div className="Content_Wrapper">
        <Article docInfo={docInfo} />
      </div>
    </div>
  );
}