import React from 'react';
import Icon from '@common/icon';
import { useHistory } from 'react-router-dom';
import './index.css';

export default function RecentContent({
  space = {},
  title = '',
  updated_at = '',
  doc_id = '',
  user = {}
}) {
  const history = useHistory();
  const onJumpToArticle = () => {
    history.push(`/article/${doc_id}/`);
  };
  return (
    <div className="Recent_Content">
      <div className="Recent_Content_Left">
        <Icon type="file-text" />
        <div className="Recent_Content_Left_Info">
          <p>{title}</p>
          <span>{`${user.name} / ${space.name}`}</span>
          <span>{updated_at} 编辑了文档</span>
        </div>
      </div>
      <div className="Recent_Content_Right">
        <Icon
          onClick={onJumpToArticle}
          className="Recent_Content_Item"
          type="edit" />
        <Icon
          className="Recent_Content_Item Recent_Content_Item_More"
          type="ellipsis" />
      </div>
    </div>
  );
};