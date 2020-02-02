import React, { useContext, useCallback, useState } from 'react';
import Breadcrumb from '@common/breadcrumb';
import Button from '@common/button';
import Modal from '@common/modal';
import { parseUrlQuery, delay, checkBrowser } from '@util/util';
import { useHistory } from 'react-router-dom';
import { catalogContext } from '@context/catalog-context';
import { createNewDoc, updateCatalogService } from '@util/commonFun';
import axiosInstance from '@util/axiosInstance';

const { isMobile } = checkBrowser();

function onDeleteSpace(spaceId, __history__) {
  Modal.confirm({
    title: '确认删除该空间吗？QAQ',
    subTitle: '如果该空间下有文档，会被一并删除。且无法恢复，请慎重。',
    onOk: async () => {
      const [error, data] = await axiosInstance.post('spaces/delete', { space_id: spaceId });
      // 加历史记录
      // const [, recentData] = await axiosInstance.post('add/recent', {
      //   space_id: spaceId, // 空间id
      //   space_name: spaceName, // 空间名称
      //   type: '' // 类型
      // });
      if (!error && data && data.STATUS === 'OK') {
        __history__.replace('/space/');
      }
    }
  });
}

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
        history.push(`/simditor/${docId}?spaceId=${spaceId}`);
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
  console.log(history);

  return <div className="chapter-header flex">
    <Breadcrumb crumbs={crumbs} />
    <div className="flex">
      <Button
        content="删除"
        type="danger"
        style={{ marginRight: '20px' }}
        loading={loading}
        onClick={() => {
          onDeleteSpace(spaceId, history);
        }} />
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