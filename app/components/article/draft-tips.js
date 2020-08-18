import React, { useContext } from 'react';
import { formatTimeStamp, parseUrlQuery, checkBrowser } from '@util/util';
import { Link } from 'react-router-dom';
import userContext from '@context/user/userContext';
import { Tag } from 'xigua-components/dist/js/index.js';

const { isMobile } = checkBrowser();

export default function DraftTips({
  docInfo
}) {
  if (!docInfo || (!docInfo.title_draft && !docInfo.html_draft)) {
    return null;
  }
  const { userInfo } = useContext(userContext);
  const { pathname } = window.location;
  const { spaceId = '', content = '' } = parseUrlQuery();
  const editorLink = pathname.replace(/\/article\//, '/simditor/') + `?spaceId=${spaceId}&content=draft&action=update`;
  const originLink = `${pathname}?spaceId=${spaceId}&content=origin`;

  let draftClasses = 'article-draftTips__warpper ';
  draftClasses += `${isMobile ? 'article-draftTip__mobile' : ''}`;

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
            <span>{userInfo.name}</span>
            最后更改于
            <span>{formatTimeStamp(docInfo.draft_update_at)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}