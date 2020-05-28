import React from 'react';
import { SPACE_TYPE_ICON } from '@config/index';
import Icon from '@common/icon';
import { NavLink } from 'react-router-dom';

export function SpaceLists({ loading, spaces, onChooseSpace }) {
  if (loading) {
    return <div className="create_loading">
      <Icon type="loading" />
      <span>正在加载...</span>
    </div>;
  }
  if (spaces.length === 0) {
    return <div className="create-modal__tips">
      您还未创建过知识库哟，
      <NavLink to="/new">去创建</NavLink>
      ,文档是存在知识库里。
    </div>;
  }
  return spaces.map(n =>
    <div
      onClick={() => { onChooseSpace(n); }}
      key={n.id}
      className="header-spaces__list flex">
      <img src={SPACE_TYPE_ICON[n.scene]} />
      <span style={{ maxWidth: 'calc(100% - 100px)' }}
        className="ellipsis">{n.name}</span>
    </div >
  );
}