import React, { Fragment } from 'react';
import { FAV_ICON } from '../../config/index.js';
import Search from '../search/search.js';
import Avatar from '../avatar/avatar.js';
import Icon from '@common/icon';
import { Link } from 'react-router-dom';
import Popover from '../popover/index.js';
import './header.css';

function Content() {
  return (
    <Fragment>
      <div className="Header_Popover_Add_Item flex">
        <Icon type="plus-circle" />
        <span>新建文档</span>
      </div>
      <div className="Header_Popover_Add_Item flex">
        <Icon type="plus-circle" />
        <span>新建知识库</span>
      </div>
    </Fragment>
  );
}

export default function Header() {
  return (
    <div className="Header_Wrapper animated">
      <div className="Header_container">
        <div className="Header_left">
          <img src={FAV_ICON}
            className="Header_left_favicon"
            alt=""/>
          <h1 className="Header_title ellipsis">一日一记</h1>
          <Search />
          <Link to="/about"
            className="Header_link Header_link_workspace Header_link_actived">工作台</Link>
          <Link to="/entertainment"
            className="Header_link">娱乐/游戏</Link>
          <Link to="/news"
            className="Header_link">新闻</Link>
          <Link to="/more"
            className="Header_link Header_link_more"><Icon type="ellipsis" /></Link>
        </div>
        <div className="Header_right">
          <Popover
            className="Header_Popover_Add"
            content={<Content />}>
            <Icon
              className="Header_Popover_Add_Icon"
              type="plus-circle" />
            <Icon type="caret-down" />
          </Popover>
          <Avatar />
        </div>
      </div>
    </div>
  );
}