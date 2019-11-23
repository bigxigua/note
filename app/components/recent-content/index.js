import React from 'react';
import Icon from '@common/icon';
import { useHistory } from 'react-router-dom';
import { formatTimeStamp } from '@util/util';
import './index.css';

export default function RecentContent({
  space = {},
  title = '',
  updated_at = '',
  doc_id = '',
  space_id = '',
  user = {}
}) {
  const history = useHistory();
  const onJumpToArticle = (type) => {
    history.push(`/${type}/${doc_id}/?spaceId=${space_id}`);
  };
  return (
    <div className="Recent_Content"
      onClick={() => { onJumpToArticle('article'); }}>
      <div className="Recent_Content_Left">
        <img src="/images/documentation.png" />
        {/* <Icon type="file-text" /> */}
        <div className="Recent_Content_Left_Info">
          <p>{title}</p>
          <span>{`${user.name || user.account} / ${space.name}`}</span>
          <span>{formatTimeStamp(updated_at)} 编辑了文档</span>
        </div>
      </div>
      <div className="Recent_Content_Right">
        <Icon
          onClick={(e) => { onJumpToArticle('editor'); e.stopPropagation(); }}
          className="Recent_Content_Item"
          type="edit" />
        <Icon
          className="Recent_Content_Item Recent_Content_Item_More"
          type="ellipsis" />
      </div>
    </div>
  );
};