import React, { useEffect, useState } from 'react';
import ArticleHeader from '@components/header-article';
import Editormd from '@components/editormd';
import SiderTips from '@components/sider-tips';
import axiosInstance from '@util/axiosInstance';
import useMessage from '@hooks/use-message';
import { checkBrowser, getIn } from '@util/util';
import './index.css';

const { isMobile } = checkBrowser();

export default function Editor() {
  const message = useMessage();
  const [docInfo, setDocInfo] = useState(undefined);
  async function fetchDocDetail() {
    const docId = window.location.pathname.split('/').filter(n => n)[1];
    const [error, data] = await axiosInstance.get(`docs?type=detail&docId=${docId}`);
    if (error || !Array.isArray(data) || data.length === 0) {
      message.error({ content: getIn(error, ['message'], '获取文档信息失败') });
      return;
    }
    setDocInfo(data[0]);
  }
  useEffect(() => {
    fetchDocDetail();
  }, []);
  return (
    <div className="container"
      style={{ overflow: 'hidden' }}>
      <ArticleHeader docInfo={docInfo} />
      <div className="content_wrapper_editor">
        <Editormd docInfo={docInfo} />
        {!isMobile && <SiderTips />}
      </div>
    </div>
  );
}