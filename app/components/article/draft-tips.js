import React from 'react';
import Tag from '@common/tag';
import { formatTimeStamp, parseUrlQuery, checkBrowser } from '@util/util';
import { Link } from 'react-router-dom';

const { isMobile } = checkBrowser();

export default function DraftTips({
  docInfo
}) {
  if (!docInfo || (!docInfo.title_draft && !docInfo.markdown_draft)) {
    return null;
  }
  const { pathname } = window.location;
  const { spaceId = '', content = '' } = parseUrlQuery();
  const editorLink = pathname.replace(/\/article\//, '/simditor/') + `?spaceId=${spaceId}&content=draft`;
  const originLink = `${pathname}?spaceId=${spaceId}&content=origin`;

  let draftClasses = 'Article_DraftTips_Warpper ';
  draftClasses += `${isMobile ? 'article_draftTip_mobile' : ''}`;

  return (
    <div className={draftClasses}>
      <div className="Article_DraftTips flex">
        <img src="/images/draft.png" />
        <div>
          <div className="article-draftTips__p">
            当前文档的最新内容尚未更新（默认显示最新草稿内容）
            <Tag color="#47c479">
              <Link to={`${editorLink}`}>去更新</Link>
            </Tag>
            {content !== 'origin' && <Tag><Link to={`${originLink}`}>显示原文档</Link></Tag>}
          </div>
          <p style={{ marginTop: '5px' }}>
            <span>{docInfo.user.name}</span>
            最后更改于
            <span>{formatTimeStamp(docInfo.draft_update_at)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}