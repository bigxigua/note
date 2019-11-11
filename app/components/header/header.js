import React from 'react';
import { FAV_ICON } from '../../config/index.js';
import Search from '../search/search.js';
import Avatar from '../avatar/avatar.js';
import Icon from '../icon/icon.js';
import './header.css';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="Header_Wrapper">
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
          <Avatar />
        </div>
      </div>
    </div>
  );
}