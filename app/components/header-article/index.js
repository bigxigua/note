import React, { useContext, useState, useEffect, useCallback } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Icon from '@common/icon';
import Button from '@common/button';
import Input from '@common/input';
import Modal from '@common/modal';
import useMessage from '@hooks/use-message';
import Breadcrumb from '@common/breadcrumb';
import { Link, useHistory } from 'react-router-dom';
import List from '@common/list';
import Popover from '@components/popover';
import editorContext from '@context/editor/editorContext';
import useSaveContent from '@hooks/use-save-content';
import { formatTimeStamp, parseUrlQuery, getIn, checkBrowser } from '@util/util';
import { deleteDoc, setDocToTemplate } from '@util/commonFun';
import { addToShortcutEntry, toggleShare } from '@util/commonFun2';
import './index.css';

const { isMobile } = checkBrowser();
const message = useMessage();

const settingList = [{
  text: '删除',
  key: 'delete'
}, {
  text: '设置为模版',
  key: 'template'
}, {
  text: '添加到快捷入口',
  key: 'addindex'
}];

async function onUpdate(update, editor, docId, spaceId) {
  const [error] = await update(editor);
  if (!error) {
    // 该字段用来表示，正在更新不需要使用navigator.sendBeacon来保存草稿。
    window.IS_UPDATED_UNLOAD = true;
    window.location.replace(window.location.origin + `/article/${docId}?spaceId=${spaceId}&content=origin`);
  }
}

function onListItemClick({ key }, docInfo = {}, history) {
  const catalog = JSON.parse(getIn(docInfo, ['space', 'catalog'], '{}'));
  const { doc_id, title, space_id, html } = docInfo;
  const url = `${window.location.origin}/article${doc_id}?spaceId=${space_id}`;
  switch (key) {
    case 'delete':
      deleteDoc({
        catalog,
        docId: doc_id,
        docTitle: title,
        spaceId: space_id
      }, (success) => { success && history.replace(`/spacedetail?spaceId=${space_id}`); });
      break;
    case 'template':
      setDocToTemplate({ html, title, url, docId: doc_id });
      break;
    case 'addindex':
      addToShortcutEntry({ title, url, type: 'XIGUA_DOC', signId: doc_id });
      break;
    default:
      break;
  }
};

function Setting({ docInfo, history }) {
  return <List
    onTap={(info) => { onListItemClick(info, docInfo, history); }}
    list={settingList}></List>;
}

function ShareLink({ docId }) {
  const link = `${window.location.origin}/share/${docId}`;
  const onCopy = (e) => {
    message.success({ content: '已复制' });
  };
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

export default function ArticleHeader({
  docInfo = {},
  className = ''
}) {
  if (!docInfo || !docInfo.doc_id) {
    return null;
  }
  const { spaceId = '', action } = parseUrlQuery();
  const update = useSaveContent({ publish: true, spaceId });
  const [updateDisabled, setUpdateState] = useState(action !== 'update');
  // 文档分享状态
  const [shareStatus, setShareStatus] = useState(docInfo.is_share);
  // 正在开启/关闭分享
  const [isFetching, setFetching] = useState(false);
  const { editor, saveContentStatus } = useContext(editorContext);
  const isArticlePage = /^\/article\//.test(window.location.pathname);
  const isEditPage = /^\/simditor\//.test(window.location.pathname);
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const history = useHistory();
  const search = history.location.search;

  useEffect(() => {
    editor && editor.on('valuechanged', () => {
      setUpdateState(false);
    });
  }, [editor]);

  useEffect(() => {
    setShareStatus(docInfo.is_share);
  }, [docInfo]);

  const crumbs = [{
    text: '文档',
    pathname: '/docs'
  }, {
    text: getIn(docInfo, ['space', 'name'], ''),
    pathname: `/spacedetail?spaceId=${spaceId}`
  }, {
    text: getIn(docInfo, ['title'], ''),
    pathname: `/${isArticlePage ? 'article' : 'simditor'}/${docId}?spaceId=${spaceId}`
  }];

  // 文档开启分享
  const onShare = useCallback(async (share) => {
    if (share === shareStatus /* copy */) {
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
    console.log(share, shareStatus);
    const result = await toggleShare({ share, docId });
    setFetching(false);
    setShareStatus(share);
    if (result && share === '1') {
      Modal.confirm({
        title: '文档已分享',
        subTitle: '可复制下面链接进行访问',
        top: '200px',
        content: <ShareLink docId={docId} />,
        footer: 'none'
      });
    }
  }, [docId, shareStatus, isFetching]);

  function ShareButtons() {
    if (!isArticlePage) {
      return null;
    }
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

  const saveText = isMobile ? '已保存' : `保存于 ${formatTimeStamp(new Date())}`;
  const classes = `article-header ${isMobile ? 'article-header_mobile' : ''} ${className}`;
  return (
    <div className={$.trim(classes)}>
      <div className="article-header_content">
        <div className="article-header_left">
          {!isMobile &&
            <Link
              className="article-header_title flex"
              to="/" />}
          <Breadcrumb crumbs={isMobile ? crumbs.slice(1) : crumbs} />
          <div className="article-header__save">
            {saveContentStatus === 0 && <span>正在保存...</span>}
            {saveContentStatus === 1 && (<span>{saveText}</span>)}
          </div>
        </div>
        <div className="article-header_right">
          <ShareButtons />
          {isArticlePage && <div className="article-header__edit flex">
            <Button
              type="primary"
              content="编辑"
              onClick={() => { history.push(`/simditor/${docId}${search}`); }} />
          </div>}
          {isEditPage && <Button
            type="primary"
            disabled={updateDisabled}
            onClick={() => { onUpdate(update, editor, docId, spaceId); }}>更新</Button>}

          <Popover
            className="avatar-wrapper"
            content={<Setting docInfo={docInfo}
              history={history} />}>
            <Icon type="ellipsis"
              className="article-header_Fun_Icon" />
          </Popover>
        </div>
      </div>
    </div>
  );
}