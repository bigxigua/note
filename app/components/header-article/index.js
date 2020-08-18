import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Icon, Button, Breadcrumb } from 'xigua-components/dist/js';
import { Link, useHistory } from 'react-router-dom';
import Popover from '@components/popover';
import { Setting, ShareButtons } from './components';
import editorContext from '@context/editor/editorContext';
import useSaveContent from '@hooks/use-save-content';
import { formatTimeStamp, parseUrlQuery, getIn } from '@util/util';
import './index.css';

async function onUpdate(update, editor, docId, spaceId) {
  const [error] = await update(editor);
  if (!error) {
    // 该字段用来表示，正在更新不需要使用navigator.sendBeacon来保存草稿。
    window.IS_UPDATED_UNLOAD = true;
    window.location.replace(window.location.origin + `/article/${docId}?spaceId=${spaceId}&content=origin`);
  }
}

/**
  * 文章页Header
  * @param {object} docInfo - 当前文档信息
  * @param {object} spaceInfo - 当前文档空间信息
  * @param {string} className - className
*/
export default function ArticleHeader({
  docInfo = {},
  spaceInfo = {},
  className = ''
}) {
  if (!docInfo || !docInfo.doc_id) {
    return null;
  }
  const isMobile = window.isMobile;
  const { spaceId = '', action } = parseUrlQuery();
  const update = useSaveContent({ publish: true, spaceId });
  const [updateDisabled, setUpdateState] = useState(action !== 'update');
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

  const crumbs = [{
    text: '文档',
    pathname: '/docs',
  }, {
    text: getIn(spaceInfo, ['name'], ''),
    pathname: `/spacedetail?spaceId=${spaceId}`,
  }, {
    text: getIn(docInfo, ['title'], ''),
    pathname: `/${isArticlePage ? 'article' : 'simditor'}/${docId}?spaceId=${spaceId}`,
  }];

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
          <ShareButtons docInfo={docInfo} />
          <Button
            type="primary"
            hide={!isArticlePage}
            content="编辑"
            onClick={() => { history.push(`/simditor/${docId}${search}`); }} />
          <Button
            type="primary"
            hide={!isEditPage}
            disabled={updateDisabled}
            onClick={() => { onUpdate(update, editor, docId, spaceId); }}>更新</Button>
          <Popover
            className="avatar-wrapper"
            content={<Setting docInfo={docInfo} />}>
            <Icon type="ellipsis"
              className="article-header_Fun_Icon" />
          </Popover>
        </div>
      </div>
    </div>
  );
}