import React, { useContext, useCallback } from 'react';
import Breadcrumb from '@common/breadcrumb';
import Button from '@common/button';
import { parseUrlQuery, delay } from '@util/util';
import { useHistory } from 'react-router-dom';
import { catalogContext } from '@context/catalog-context';
import { createNewDoc, updateCatalogService } from '@util/commonFun';

export default function ChapterHeader({
  userInfo = {},
  space = {}
}) {
  const { info: { catalog } } = useContext(catalogContext);
  const history = useHistory();
  const { pathname, search } = window.location;
  const { type = '', spaceId = '' } = parseUrlQuery();
  // 面包屑导航
  const crumbs = [{
    text: userInfo.name,
    render: n => { return n.text; }
  }, {
    text: '空间',
    pathname: '/space/'
  }, {
    text: space.name,
    pathname: `${pathname + search}`
  }];
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
  const onCreateNewDoc = useCallback((info) => {
    createNewDoc(info, async ({ docId, spaceId }) => {
      if (docId && spaceId) {
        await delay();
        history.push(`/edit/${docId}?spaceId=${spaceId}`);
      } else {
        console.log('[创建文档出错] ');
      }
    });
  }, []);

  return <div className="Chapter_Header flex">
    <Breadcrumb crumbs={crumbs} />
    <div className="Chapter_Header_Operation flex">
      <Button
        content="新建文档"
        onClick={() => {
          onCreateNewDoc({
            space_id: spaceId
          });
        }} />
      {type.toLocaleLowerCase() === 'toc'
        ? <Button
          content="更新"
          disabled={false}
          onClick={() => onUpdateCatalog({
            spaceId,
            catalog
          })}
          type="primary" />
        : <Button
          content="编排目录"
          link={{
            to: `/spacedetail?spaceId=${spaceId}&type=toc`,
            target: 'blank'
          }}
          disabled={catalog.length < 2}>
        </Button>}
    </div>
  </div>;
}