import React, { useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@common/button';
import userContext from '@context/user/userContext';

export default function ShareHeader({ docInfo = {} }) {
  const { userInfo = {} } = useContext(userContext);
  const isSelf = userInfo.uuid && docInfo.uuid && docInfo.uuid === userInfo.uuid;
  const history = useHistory();

  const onButtonClick = useCallback(() => {
    const { space_id, doc_id } = docInfo;
    history.push(`/article/${doc_id}?spaceId=${space_id}`);
  }, [docInfo]);

  return <div className="share-header">
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