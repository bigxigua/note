import React, { useContext } from 'react';
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
  docInfo = {}
}) {
  const { spaceId = '' } = parseUrlQuery();
  const update = useSaveContent({ publish: true, spaceId });
  const { editor, saveContentStatus } = useContext(editorContext);
  const isArticlePage = /^\/article\//.test(window.location.pathname);
  const isEditPage = /^\/edit\//.test(window.location.pathname);
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const history = useHistory();
  const search = history.location.search;
  function jumpToEditor() {
    history.push(`/edit/${docId}${search}`);
  }
  // 更新发布文档
  async function onUpdate() {
    const [error] = await update(editor);
    if (!error) {
      window.location.replace(window.location.origin + `/article/${docId}?spaceId=${spaceId}&content=origin`);
      // history.push(`/article/${docId}?spaceId=${spaceId}&content=origin`);
    }
  }
  const crumbs = [{
    text: getIn(docInfo, ['space', 'name'], ''),
    pathname: `/spacedetail?spaceId=${spaceId}`
  }, {
    text: getIn(docInfo, ['title'], ''),
    pathname: `/${isArticlePage ? 'article' : 'edit'}/${docId}?spaceId=${spaceId}`
  }];
  const saveText = isMobile ? '已保存' : `保存于 ${formatTimeStamp(new Date())}`;
  return (
    <div className="Article_Header">
      <div className="Article_Header_Wrapper animated">
        <div className="Article_Header_left">
          <Link className="Article_Header_title flex"
            to="/">
          </Link>
          {!isMobile && <Breadcrumb crumbs={crumbs} />}
          <div className="Article_Header_Save">
            {saveContentStatus === 0 && <span>正在保存...</span>}
            {saveContentStatus === 1 && (<span>{saveText}</span>)}
          </div>
        </div>
        <div className="Article_Header_right">
          {isArticlePage && <div className="Article_Header_Edit_Btn flex">
            <Button
              type="primary"
              content="编辑"
              onClick={jumpToEditor} />
          </div>}
          {isEditPage && <Button
            type="primary"
            onClick={onUpdate}>更新</Button>}
          <Icon type="ellipsis"
            className="Article_Header_Fun_Icon" />
        </div>
      </div>
    </div>
  );
}