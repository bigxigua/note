import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import Search from '@components/search';
import Avatar from '../avatar/avatar.js';
import Icon from '@common/icon';
import CreateDoc from '@components/create-doc';
import Popover from '@components/popover';
import './header.css';

export default function Header() {
  const [visible, setVisible] = useState(false);
  const onCreateDoc = (stat) => {
    setVisible(stat);
  };
  function Content() {
    return (
      <Fragment>
        <div className="Header_Popover_Add_Item flex"
          onClick={() => { onCreateDoc(true); }}>
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
  return (
    <div className="Header_Wrapper animated">
      <div className="Header_container">
        <div className="Header_left">
          <Link to="/"
            className="Header_title ellipsis">
          </Link>
          <Search className="Header_Search" />
          <Link to="/"
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
        {visible && <CreateDoc onModalChange={onCreateDoc} />}
      </div>
    </div>
  );
}