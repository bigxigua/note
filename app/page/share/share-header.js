import React, { useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'xigua-components/dist/js';
import userContext from '@context/user/userContext';
import { checkBrowser } from '@util/util';

export default function ShareHeader({ docInfo = {} }) {
  const { userInfo = {} } = useContext(userContext);
  const isSelf = userInfo.uuid && docInfo.uuid && docInfo.uuid === userInfo.uuid;
  const history = useHistory();
  const { isMobile } = checkBrowser();

  const onButtonClick = useCallback(() => {
    const { space_id, doc_id } = docInfo;
    history.push(`/article/${doc_id}?spaceId=${space_id}`);
  }, [docInfo]);

  return <div className={$.trim(`share-header ${isMobile ? 'share-header__mobile' : ''}`)}>
    <div className="share-header__content">
      <div className="share-header__left">
        <a className="share-header__logo"
          href="/"></a>
        <span>{docInfo.title}</span>
      </div>
      <div className="share-header__right">
        {
          isSelf && <Button
            content="查看原始文档"
            style={{ marginLeft: '20px' }}
            onClick={onButtonClick}
            type="primary" />
        }
      </div>
    </div>
  </div>;
}