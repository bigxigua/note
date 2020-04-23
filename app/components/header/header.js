import React, { Fragment, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import HeaderSearch from '@components/header-search';
import Avatar from '@components/avatar/avatar';
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
  const activeStyle = { color: '#262626', fontWeight: 'bold' };
  return (
    <div className={$.trim(classes)}>
      <div className="header-container">
        <div className="header-left">
          <Link to="/"
            className="header-title ellipsis">
          </Link>
          <HeaderSearch />
          <NavLink
            to="/"
            activeStyle={activeStyle}
            className="header-link">工作台</NavLink>
          <a
            className="header-link"
            href="https://leetcode-cn.com/"
            style={{ color: 'rgb(255, 109, 0)' }}
            target="_blank">
            leetcode
          </a>
          <a
            className="header-link"
            href="https://www.zhihu.com/"
            style={{ color: '#0084ff' }}
            target="_blank">
            知乎
          </a>
          <Link to="/more"
            className="header-link header_disabled header-link_more"><Icon type="ellipsis" /></Link>
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