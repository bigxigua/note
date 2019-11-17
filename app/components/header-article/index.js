import React from 'react';
import { FAV_ICON } from '@config/index';
import Icon from '@common/icon';
import Button from '@common/button';
import Popover from '@components/popover';
import { Link, useHistory } from 'react-router-dom';
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

export default function ArticleHeader() {
  const isArticlePage = /^\/article\//.test(window.location.pathname);
  const isEditPage = /^\/edit\//.test(window.location.pathname);
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const history = useHistory();
  function jumpToEditor () {
    history.push(`/editor/${docId}`);
  }
  return (
    <div className="Article_Header">
      <div className="Article_Header_Wrapper animated">
        <div className="Article_Header_left">
          <img src={FAV_ICON}
            className="Article_Header_favicon"
            alt=""/>
          <Link className="Article_Header_title ellipsis"
            to="/">一日一记</Link>
        </div>
        <div className="Article_Header_right">
          {isArticlePage && <div className="Article_Header_Edit_Btn flex">
            <button className="button"
              onClick={jumpToEditor}>编辑</button>
            <Icon type="caret-down" />
          </div>}
          {isEditPage && <Button>更新</Button>}
          <Popover content={content}>
            <Icon type="ellipsis"
              className="Article_Header_Fun_Icon" />
          </Popover>
        </div>
      </div>
    </div>
  );
}