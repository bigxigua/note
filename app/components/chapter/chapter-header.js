import React, { useContext, useCallback } from 'react';
import { useImmer } from 'use-immer';
import Breadcrumb from '@common/breadcrumb';
import Button from '@common/button';
import Modal from '@common/modal';
import CreateDocButtton from '@components/create-doc-button';
import { parseUrlQuery, delay, checkBrowser } from '@util/util';
import { useHistory } from 'react-router-dom';
import { catalogContext } from '@context/catalog-context';
import { createNewDoc, updateCatalogService } from '@util/commonFun';
import axiosInstance from '@util/axiosInstance';

const { isMobile } = checkBrowser();

function onDeleteSpace(space, __history__) {
  const {
    space_id,
    name
  } = space;
  Modal.confirm({
    title: '确认删除该空间吗？QAQ',
    subTitle: '如果该空间下有文档，会被一并删除。且无法恢复，请慎重。',
    onOk: async () => {
      const [error, data] = await axiosInstance.post('spaces/delete', { space_id });
      // 加历史记录
      try {
        await axiosInstance.post('add/recent', {
          space_id, // 空间id
          space_name: name, // 空间名称
          type: 'DeleteSpace' // 类型
        });
      } catch (err) {
        console.log(err);
      }
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
  const [state, setState] = useImmer({
    loading: false
  });
  const { info: { catalog } } = useContext(catalogContext);
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
    setState(draft => {
      draft.loading = true;
    });
    await createNewDoc(info, async ({ docId, spaceId }) => {
      if (docId && spaceId) {
        await delay();
        history.push(`/simditor/${docId}?spaceId=${spaceId}`);
      } else {
        console.log('[创建文档出错] ');
      }
    });
    setState(draft => {
      draft.loading = false;
    });
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
  return <div className="chapter-header flex">
    <Breadcrumb crumbs={crumbs} />
    <div className="flex">
      <Button
        content="删除"
        type="danger"
        style={{ marginRight: '20px' }}
        onClick={() => {
          onDeleteSpace(space, history);
        }} />
      <CreateDocButtton spaceId={spaceId} />
      {/* <Button
        content="新建文档"
        loading={state.loading}
        onClick={() => {
          onCreateNewDoc({
            space_id: spaceId
          });
        }} /> */}
      {renderActionButton()}
    </div>
  </div>;
}