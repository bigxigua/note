import React, { useCallback } from 'react';
import Tag from '@common/tag';
import { formatTimeStamp } from '@util/util';
import { Link, useHistory } from 'react-router-dom';
import './index.css';

// 渲染tag
function renderTag(info) {
  const { status, html_draft, title_draft, is_template } = info;
  return <>
    {is_template === '1' && <Tag color="#f50">模版</Tag>}
    {status === '0' && <Tag color="rgb(255, 85, 0)">已删除</Tag>}
    {(html_draft || title_draft) && <Tag>未更新</Tag>}
  </>;
}

export default function DocItem({ docInfo = {} }) {
  const { user, space, title, updated_at_timestamp, cover, abstract = '' } = docInfo;
  const classes = `docItem ${cover ? 'docItem_has_cover' : ''}`;
  const history = useHistory();
  const onDocItemClick = useCallback((info) => {
    history.push(`/article/${info.doc_id}?spaceId=${info.space_id}`);
  }, []);
  return (
    <div className={classes}
      onClick={() => { onDocItemClick(docInfo); }}>
      <div className="docItem_content">
        <div className="docItem_content_left">
          <h4>{title}</h4>
          <p>{abstract || '空空如也'}</p>
        </div>
        {cover && <img className="docItem_content_img"
          src={cover} />}
      </div>
      <div className="docItem_meta">
        {renderTag(docInfo)}
        <span className="ellipsis">{user.name}</span>
        <span className="docItem_meta-name">发布于</span>
        <Link className="ellipsis"
          to={`/article/${docInfo.doc_id}?spaceId=${docInfo.space_id}`}>{space.name}</Link>
        <span className="docItem_meta-name">{formatTimeStamp(updated_at_timestamp, 'simple')}</span>
      </div>
    </div>
  );
};