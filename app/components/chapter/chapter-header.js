import React, { useContext, useCallback } from 'react';
import Breadcrumb from '@common/breadcrumb';
import Button from '@common/button';
import Modal from '@common/modal';
import CreateDocButtton from '@components/create-doc-button';
import { parseUrlQuery, checkBrowser, getIn } from '@util/util';
import { useHistory } from 'react-router-dom';
import { catalogContext } from '@context/catalog-context';
import { updateCatalogService } from '@util/commonFun';
import axiosInstance from '@util/axiosInstance';
import useMessage from '@hooks/use-message';

const message = useMessage();

const { isMobile } = checkBrowser();

function onDeleteSpace(space, __history__) {
  const {
    space_id,
    name
  } = space;
  Modal.confirm({
    title: '确认物理永久删除该空间吗？QAQ',
    subTitle: '如果该空间下有文档，会被一并删除。且无法恢复，请慎重。',
    onOk: async () => {
      const [error, data] = await axiosInstance.post('spaces/delete', { space_id });
      if (error || getIn(data, ['STATUS']) !== 'OK') {
        message.error({ content: getIn(error, ['message'], '系统繁忙') });
        return;
      }
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
      __history__.replace('/space/');
    }
  });
}

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
      window.location.href = `/spacedetail?spaceId=${spaceId}`;
      // history.push(`/spacedetail?spaceId=${spaceId}`);
    } else {
      message.error({ content: getIn(error, ['message'], '更新文档失败') });
    }
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

  const claseses = $.trim(`chapter-header ${isMobile ? 'chapter-header__mobile' : ''}`);

  return <div className={claseses}>
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
      {renderActionButton()}
    </div>
  </div>;
}