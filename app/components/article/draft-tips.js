import React from 'react';
import Tag from '@common/tag';
import { formatTimeStamp, parseUrlQuery } from '@util/util';
import { Link } from 'react-router-dom';

export default function DraftTips({
  docInfo
}) {
  if (!docInfo || (!docInfo.title_draft && !docInfo.markdown_draft)) {
    return null;
  }
  const { pathname } = window.location;
  const { spaceId = '', content = '' } = parseUrlQuery();
  const editorLink = pathname.replace(/\/article\//, '/edit/') + `?spaceId=${spaceId}&content=draft`;
  const originLink = `${pathname}?spaceId=${spaceId}&content=origin`;
  return (
    <div className="Article_DraftTips_Warpper">
      <div className="Article_DraftTips flex">
        <img src="/images/draft.png" />
        <div>
          <div className="Article_DraftTips_P">
            当前文档的最新内容尚未更新（默认显示最新草稿内容）
            <Tag color="#47c479">
              <Link to={`${editorLink}`}>去更新</Link>
            </Tag>
            {content !== 'origin' && <Tag><Link to={`${originLink}`}>显示原文档</Link></Tag>}
          </div>
          <p>
            <span>{docInfo.user.name}</span>
            最后更改于
            <span>{formatTimeStamp(docInfo.draft_update_at)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}