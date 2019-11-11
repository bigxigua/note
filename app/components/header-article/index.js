import React from 'react';
import { FAV_ICON } from '../../config/index.js';
// import Icon from '../icon/icon.js';
import './index.css';

export default function ArticleHeader() {
  return (
    <div className="Article_Header_Wrapper animated">
      <div className="Article_Header_left">
        <img src={FAV_ICON}
          className="Article_Header_favicon"
          alt=""/>
        <h1 className="Article_Header_title ellipsis">一日一记</h1>
      </div>
      <div className="Article_Header_right">
      </div>
    </div>
  );
}