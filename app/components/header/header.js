import React, { Fragment, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FAV_ICON, SPACE_TYPE_ICON } from '@config/index';
import Search from '@components/search';
import Avatar from '../avatar/avatar.js';
import Icon from '@common/icon';
import Modal from '@common/modal';
import Popover from '@components/popover';
import axiosInstance from '@util/axiosInstance';
import userContext from '@context/user/userContext';
import './header.css';

export default function Header() {
  const { userInfo: { account } } = useContext(userContext);
  const [visible, setVisible] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const history = useHistory();
  const onItemClick = async () => {
    setVisible(true);
    const [error, data] = await axiosInstance.get('spaces', {});
    if (!error && data && data.spaces.length > 0) {
      setSpaces(data.spaces);
    } else {
      // TODO 失败提示
      console.log('[获取空间列表失败] ', error);
    }
  };
  function Content() {
    return (
      <Fragment>
        <div className="Header_Popover_Add_Item flex"
          onClick={onItemClick}>
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
  const onCancelModal = () => {
    setVisible(false);
  };
  const onConfirmModal = () => {
    setVisible(false);
  };
  // 点击创建文档
  const onChooseSpace = async (info) => {
    const { scene, space_id } = info;
    console.log(info);
    const [error, data] = await axiosInstance.post('create/doc', {
      scene,
      space_id,
      title: '无标题'
    });
    if (!error && data && data.docId) {
      // TODO 返回bookID
      history.push(`/article/${data.docId}`);
    } else {
      // TODO 错误处理
      console.log('[创建文档出错] ', error);
    }
  };
  const spacesList = spaces.map(n => {
    return (
      <div
        onClick={() => { onChooseSpace(n); }}
        key={n.id}
        className="Header_Spaces_List flex">
        <img src={SPACE_TYPE_ICON[n.scene]} />
        <span>{account}</span>
        <span>/</span>
        <span>{n.name}</span>
        <img src={`/images/${n.public === 'SELF' ? 'lock' : 'global'}.png`} />
      </div>
    );
  });
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
      <Modal
        subTitle="点击选择一个知识库"
        title="新建文档"
        footer={'none'}
        onCancel={onCancelModal}
        onConfirm={onConfirmModal}
        visible={visible} >
        {spacesList}
      </Modal>
    </div>
  );
}