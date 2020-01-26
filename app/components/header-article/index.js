import React, { useContext, useState, useEffect } from 'react';
import Icon from '@common/icon';
import Button from '@common/button';
import Breadcrumb from '@common/breadcrumb';
import { Link, useHistory } from 'react-router-dom';
import editorContext from '@context/editor/editorContext';
import useSaveContent from '@hooks/use-save-content';
import { formatTimeStamp, parseUrlQuery, getIn, checkBrowser } from '@util/util';
import './index.css';

const { isMobile } = checkBrowser();

export default function ArticleHeader({
  docInfo = {},
  className = ''
}) {
  const { spaceId = '' } = parseUrlQuery();
  const update = useSaveContent({ publish: true, spaceId });
  const [updateDisabled, setUpdateState] = useState(true);
  const { editor, saveContentStatus } = useContext(editorContext);
  const isArticlePage = /^\/article\//.test(window.location.pathname);
  const isEditPage = /^\/simditor\//.test(window.location.pathname);
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const history = useHistory();
  const search = history.location.search;

  function jumpToEditor() {
    history.push(`/simditor/${docId}${search}`);
  }

  useEffect(() => {
    editor && editor.on('valuechanged', () => {
      setUpdateState(false);
    });
  }, [editor]);

  // 更新发布文档
  async function onUpdate() {
    const [error] = await update(editor);
    if (!error) {
      window.location.replace(window.location.origin + `/article/${docId}?spaceId=${spaceId}&content=origin`);
    }
  }

  const crumbs = [{
    text: '文档列表',
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
  console.log('isArticlePage:', isArticlePage);
  return (
    <div className={classes}>
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
              onClick={jumpToEditor} />
          </div>}
          {isEditPage && <Button
            type="primary"
            disabled={updateDisabled}
            onClick={onUpdate}>更新</Button>}
          <Icon type="ellipsis"
            className="article-header_Fun_Icon" />
        </div>
      </div>
    </div>
  );
}