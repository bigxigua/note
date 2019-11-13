import React from 'react';
import { FAV_ICON } from '../../config/index.js';
import Icon from '../icon/icon.js';
import Popover from '../popover/index.js';
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
  function jumpToEditor () {
    window.location.href = '/editor/xxxxxx';
  }
  return (
    <div className="Article_Header">
      <div className="Article_Header_Wrapper animated">
        <div className="Article_Header_left">
          <img src={FAV_ICON}
            className="Article_Header_favicon"
            alt=""/>
          <h1 className="Article_Header_title ellipsis">一日一记</h1>
        </div>
        <div className="Article_Header_right">
          <div className="Article_Header_Edit_Btn flex">
            <button className="button"
              onClick={jumpToEditor}>编辑</button>
            <Icon type="caret-down" />
          </div>
          <Popover content={content}>
            <Icon type="ellipsis"
              className="Article_Header_Fun_Icon" />
          </Popover>
        </div>
      </div>
    </div>
  );
}