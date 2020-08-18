import React, { useCallback, useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Input, List, Modal } from 'xigua-components/dist/js';
import useMessage from '@hooks/use-message';
import { useHistory } from 'react-router-dom';
import { onListItemClick } from './fun';
import { toggleShare } from '@util/commonFun2';

const message = useMessage();

// 分享按钮
export function ShareLink({ docId }) {
  const link = `${window.location.origin}/share/${docId}`;
  const onCopy = () => { message.success({ content: '已复制' }); };
  return <div className="article-header__share">
    <Input defaultValue={link}
      className="article-header__share-link"
      h={32}
      disabled={true} />
    <CopyToClipboard text={link}
      onCopy={onCopy}>
      <Button content="复制"
        type="primary" />
    </CopyToClipboard>
  </div>;
}

/**
  * 更多设置
  * @param {object} docInfo - 文档信息
*/
export function Setting({ docInfo }) {
  const [isTemplate, setIsTemplate] = useState(docInfo.is_template === '1');
  const history = useHistory();
  // const isMobile = window.isMobile;

  useEffect(() => {
    setIsTemplate(docInfo.is_template === '1');
  }, [docInfo]);

  const settingList = [{
    text: '删除',
    key: 'delete'
  }, {
    text: '设置为模版',
    key: 'template',
    disabled: isTemplate
  }, {
    text: '添加到快捷入口',
    key: 'addindex'
  }];
  return <List
    onTap={(info) => { onListItemClick(info, docInfo, history, setIsTemplate); }}
    list={settingList}></List>;
}

/**
  * 分享按钮
  * @param {object} docInfo - 文档信息
*/
export function ShareButtons({ docInfo = {} }) {
  const isArticlePage = /^\/article\//.test(window.location.pathname);
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const [isFetching, setFetching] = useState(false);
  const [shareStatus, setShareStatus] = useState(docInfo.is_share);

  if (!isArticlePage || window.isMobile) {
    return null;
  }

  useEffect(() => {
    setShareStatus(docInfo.is_share);
  }, [docInfo]);

  const onShare = useCallback(async (share) => {
    if (share === shareStatus && share === '1' /* copy */) {
      Modal.confirm({
        title: '文档已分享',
        subTitle: '可复制下面链接进行访问',
        top: '200px',
        content: <ShareLink docId={docId} />,
        footer: 'none'
      });
      return;
    }
    if (isFetching) { return; }
    setFetching(true);
    const result = await toggleShare({ share, docId });
    setFetching(false);
    if (result) {
      share === '1' && Modal.confirm({
        title: '文档已分享',
        subTitle: '可复制下面链接进行访问',
        top: '200px',
        content: <ShareLink docId={docId} />,
        footer: 'none'
      });
      setShareStatus(share);
    }
  }, [docId, shareStatus, isFetching]);

  return <div className="article-header__buttons">
    <Button
      disabled={isFetching}
      loading={isFetching}
      onClick={() => { onShare('1'); }}
      className={shareStatus === '1' ? 'article-header__buttons-shareing' : ''}
      type={shareStatus === '1' ? 'primary' : 'default'}
      content={shareStatus === '1' ? '分享中' : '分享'} />
    {shareStatus === '1' && <Button
      disabled={isFetching}
      onClick={() => { onShare('0'); }}
      className="article-header__buttons-cancle"
      loading={isFetching}
      content="取消" />}
  </div>;
}