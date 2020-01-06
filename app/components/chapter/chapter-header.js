import React, { useContext, useCallback, useState } from 'react';
import Breadcrumb from '@common/breadcrumb';
import Button from '@common/button';
import { parseUrlQuery, delay, checkBrowser } from '@util/util';
import { useHistory } from 'react-router-dom';
import { catalogContext } from '@context/catalog-context';
import { createNewDoc, updateCatalogService } from '@util/commonFun';

const { isMobile } = checkBrowser();

export default function ChapterHeader({
  userInfo = {},
  space = {}
}) {
  const { info: { catalog } } = useContext(catalogContext);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { pathname, search } = window.location;
  const { type = '', spaceId = '' } = parseUrlQuery();

  // 面包屑导航
  const crumbs = [{
    text: '空间',
    pathname: '/space/'
  }, {
    text: space.name,
    pathname: `${pathname + search}`
  }];

  if (!isMobile) {
    crumbs.unshift({
      text: userInfo.name,
      render: n => n.text
    });
  }

  // 点击更新编排后的文档
  const onUpdateCatalog = useCallback(async ({ spaceId, catalog }) => {
    const [error, data] = await updateCatalogService({ spaceId, catalog });
    if (data && data.STATUS === 'OK') {
      history.push(`/spacedetail?spaceId=${spaceId}`);
    } else {
      console.log('[目录更新失败 ]', error);
    }
  }, []);

  // 新建文档
  const onCreateNewDoc = useCallback(async (info) => {
    setLoading(true);
    await createNewDoc(info, async ({ docId, spaceId }) => {
      if (docId && spaceId) {
        await delay();
        history.push(`/edit/${docId}?spaceId=${spaceId}`);
      } else {
        console.log('[创建文档出错] ');
      }
    });
    setLoading(false);
  }, []);

  function renderActionButton() {
    if (isMobile) {
      return null;
    } else if (type.toLocaleLowerCase() === 'toc') {
      return <Button
        content="更新"
        disabled={false}
        style={{ marginLeft: '20px' }}
        onClick={() => onUpdateCatalog({
          spaceId,
          catalog
        })}
        type="primary" />;
    } else {
      return <Button
        content="编排目录"
        style={{ marginLeft: '20px' }}
        link={{
          to: `/spacedetail?spaceId=${spaceId}&type=toc`,
          target: 'blank'
        }}
        disabled={catalog.length < 2}>
      </Button>;
    }
  }

  return <div className="Chapter_Header flex">
    <Breadcrumb crumbs={crumbs} />
    <div className="Chapter_Header_Operation flex">
      <Button
        content="新建文档"
        loading={loading}
        onClick={() => {
          onCreateNewDoc({
            space_id: spaceId
          });
        }} />
      {renderActionButton()}
    </div>
  </div>;
}