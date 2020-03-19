import React, { useContext, useState, useEffect, useCallback } from 'react';
import Icon from '@common/icon';
import Button from '@common/button';

import Breadcrumb from '@common/breadcrumb';
import { Link, useHistory } from 'react-router-dom';
import List from '@common/list';
import Popover from '@components/popover';
import editorContext from '@context/editor/editorContext';
import useSaveContent from '@hooks/use-save-content';
import { formatTimeStamp, parseUrlQuery, getIn, checkBrowser } from '@util/util';
import { deleteDoc, setDocToTemplate } from '@util/commonFun';
import { addToShortcutEntry } from '@util/commonFun2';
import './index.css';

const { isMobile } = checkBrowser();

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
      setDocToTemplate({ html, title, url });
      break;
    case 'addindex':
      addToShortcutEntry({ title, url, type: 'XIGUA_DOC' });
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

export default function ArticleHeader({
  docInfo = {},
  className = ''
}) {
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
    pathname: '/docs'
  }, {
    text: getIn(docInfo, ['space', 'name'], ''),
    pathname: `/spacedetail?spaceId=${spaceId}`
  }, {
    text: getIn(docInfo, ['title'], ''),
    pathname: `/${isArticlePage ? 'article' : 'simditor'}/${docId}?spaceId=${spaceId}`
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
          <div className="article-header_Save">
            {saveContentStatus === 0 && <span>正在保存...</span>}
            {saveContentStatus === 1 && (<span>{saveText}</span>)}
          </div>
        </div>
        <div className="article-header_right">
          {isArticlePage && <div className="article-header_Edit_Btn flex">
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