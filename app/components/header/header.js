import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
// import Search from '@components/search';
import Avatar from '../avatar/avatar.js';
import Icon from '@common/icon';
import CreateDoc from '@components/create-doc';
import Popover from '@components/popover';
import { checkBrowser } from '@util/util';
import './header.css';

// 创建popver cotent
function popoverContent({ handle }) {
  return (
    <Fragment>
      <div className="Header_Popover_Add_Item flex"
        onClick={() => { handle(true); }}>
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

export default function Header({
  className = ''
}) {
  const [visible, setVisible] = useState(false);
  const { isMobile } = checkBrowser();
  const classes = `header-wrapper ${isMobile ? 'header-wrapper_mobile' : ''} animated ${className}`;
  return (
    <div className={$.trim(classes)}>
      <div className="header-container">
        <div className="header-left">
          <Link to="/"
            className="Header_title ellipsis">
          </Link>
          {/* <Search className="Header_Search" /> */}
          <Link to="/"
            className="Header_link Header_link_workspace Header_link_actived">工作台</Link>
          <div className="Header_link header_disabled">娱乐/游戏</div>
          <div className="Header_link header_disabled">新闻</div>
          <Link to="/more"
            className="Header_link header_disabled Header_link_more"><Icon type="ellipsis" /></Link>
        </div>
        <div className="header-right">
          <Popover
            className="Header_Popover_Add"
            content={popoverContent({ handle: setVisible })}>
            <Icon
              className="Header_Popover_Add_Icon"
              type="plus-circle" />
            <Icon type="caret-down" />
          </Popover>
          <Avatar />
        </div>
        {visible && <CreateDoc onModalChange={setVisible} />}
      </div>
    </div>
  );
}