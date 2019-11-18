import React, { useContext } from 'react';
import { FAV_ICON } from '@config/index';
import Icon from '@common/icon';
import Button from '@common/button';
import Popover from '@components/popover';
import { Link, useHistory } from 'react-router-dom';
import editorContext from '@context/editor/editorContext';
import axiosInstance from '@util/axiosInstance';
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
  const { editor } = useContext(editorContext);
  const isArticlePage = /^\/article\//.test(window.location.pathname);
  const isEditPage = /^\/editor\//.test(window.location.pathname);
  const docId = window.location.pathname.split('/').filter(n => n)[1];
  const history = useHistory();
  function jumpToEditor () {
    history.push(`/editor/${docId}`);
  }
  async function onUpdate () {
    const markdown = editor.getMarkdown();
    const html = editor.getHtmlFromMarkDown(markdown);
    const title = $('.CodeMirror_title>input').val();
    const [error, data] = await axiosInstance.post('doc/update', {
      doc_id: docId,
      html,
      title,
      markdown,
      html_draft: html,
      markdown_draft: markdown
    });
    console.log(error, data);
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