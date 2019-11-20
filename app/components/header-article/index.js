import React, { useContext } from 'react';
import { FAV_ICON } from '@config/index';
import Icon from '@common/icon';
import Button from '@common/button';
import Popover from '@components/popover';
import { Link, useHistory } from 'react-router-dom';
import editorContext from '@context/editor/editorContext';
import useSaveContent from '@hooks/use-save-content';
import { formatTimeStamp } from '@util/util';
import './index.css';

const content = (
  <div className="Article_Header_Fun">
    <p>翻译为英文</p>
    <p>查看HTML</p>
    <p>查看Markdown</p>
    <span></span>
    <p>导出</p>
    <p>TODO...</p>
  </div>
);

export default function ArticleHeader({
  docInfo = { space: {} }
}) {
  const update = useSaveContent({ publish: true });
  const { editor, saveContentStatus } = useContext(editorContext);
  const isArticlePage = /^\/article\//.test(window.location.pathname);
  const isEditPage = /^\/editor\//.test(window.location.pathname);
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const history = useHistory();
  const search = history.location.search;
  function jumpToEditor() {
    history.push(`/editor/${docId}${search}`);
  }
  async function onUpdate() {
    update(editor);
    setTimeout(() => {
      history.push(`/article/${docId}${search}`);
    }, 500);
  }
  return (
    <div className="Article_Header">
      <div className="Article_Header_Wrapper animated">
        <div className="Article_Header_left">
          <img src={FAV_ICON}
            className="Article_Header_favicon"
            alt="" />
          <Link className="Article_Header_title ellipsis"
            to="/">一日一记&nbsp; / &nbsp;{docInfo.space.name}</Link>
          <div className="Article_Header_Save">
            {saveContentStatus === 0 && <span>正在保存...</span>}
            {saveContentStatus === 1 && (<span>保存于 {formatTimeStamp(new Date())}</span>)}
          </div>
        </div>
        <div className="Article_Header_right">
          {isArticlePage && <div className="Article_Header_Edit_Btn flex">
            <button className="button"
              onClick={jumpToEditor}>编辑</button>
            <Icon type="caret-down" />
          </div>}
          {isEditPage && <Button type="primary"
            onClick={onUpdate}>更新</Button>}
          <Popover content={content}>
            <Icon type="ellipsis"
              className="Article_Header_Fun_Icon" />
          </Popover>
        </div>
      </div>
    </div>
  );
}