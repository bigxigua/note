import React, { useContext, useCallback } from 'react';
import { Breadcrumb, Button, Modal } from 'xigua-components/dist/js';
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
    onOk: async () => {
      const [error, data] = await axiosInstance.post('space/delete', { space_id, space_name: name });
      if (error || getIn(data, ['STATUS']) !== 'OK') {
        message.error({ content: getIn(error, ['message'], '系统繁忙') });
        return;
      }
      __history__.replace('/space/');
    }
  });
}

function ActionButtons({
  type,
  spaceId,
  catalog,
  onUpdateCatalog
}) {
  if (isMobile) {
    return null;
  } else if (type.toLocaleLowerCase() === 'toc') {
    return <Button
      content="更新"
      onClick={onUpdateCatalog}
      type="primary" />;
  } else {
    return <Button
      content="编排目录"
      link={{
        to: `/spacedetail?spaceId=${spaceId}&type=toc`,
        target: 'blank'
      }}>
    </Button>;
  }
}

export default function ChapterHeader({
  userInfo = {},
  space = {}
}) {
  const { info: { catalog }, updateCatalog } = useContext(catalogContext);
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

  // 更新
  const onUpdateCatalog = useCallback(async () => {
    const [error, data] = await updateCatalogService({ spaceId, catalog });
    if (data && data.STATUS === 'OK') {
      window.location.href = `/spacedetail?spaceId=${spaceId}`;
    } else {
      message.error({ content: getIn(error, ['message'], '更新文档失败') });
    }
  }, [spaceId, catalog]);

  // 新建文档
  const onCreate = useCallback(() => {
    const data = catalog.slice(0);
    data.splice(1, 0, { type: 'DOC', level: 0, status: '1', docId: `NEW_DOC_${catalog}` });
    updateCatalog({ catalog: data });
  }, [catalog]);

  const claseses = $.trim(`chapter-header ${isMobile ? 'chapter-header__mobile' : ''}`);
  const isEmptySpace = !catalog.length || (catalog.length === 1 && catalog[0].type === 'META');

  return <div className={claseses}>
    <Breadcrumb crumbs={crumbs} />
    <div className="flex">
      <Button
        content="删除"
        type="danger"
        disabled={!isEmptySpace}
        style={{ marginRight: '20px' }}
        onClick={() => {
          onDeleteSpace(space, history);
        }} />
      <Button
        content="新建"
        hide={type !== 'toc'}
        style={{ marginRight: '20px' }}
        onClick={onCreate} />
      <ActionButtons
        type={type}
        spaceId={spaceId}
        catalog={catalog}
        onUpdateCatalog={onUpdateCatalog} />
    </div>
  </div>;
}