import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FAV_ICON } from '@config/index';
import Search from '@components/search';
import Avatar from '../avatar/avatar.js';
import Icon from '@common/icon';
import Modal from '@common/modal';
import Popover from '@components/popover';
import './header.css';

function Content() {
  const onCreateSpace = () => {
    console.log('------');
  };
  return (
    <Fragment>
      <div className="Header_Popover_Add_Item flex"
        onClick={onCreateSpace}>
        <Icon type="plus-circle" />
        <span>新建文档</span>
      </div>
      <div className="Header_Popover_Add_Item flex">
        <Icon type="plus-circle" />
        <Link to="/new">新建知识库</Link>
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
          <Link to="/"
            className="Header_title ellipsis">一日一记</Link>
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
      <Modal visible={true}
        title={'FUC'} />
    </div>
  );
}