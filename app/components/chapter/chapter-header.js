import React, { useContext, useCallback, useState } from 'react';
import Breadcrumb from '@common/breadcrumb';
import Button from '@common/button';
import CreateDoc from '@components/create-doc';
import { parseUrlQuery } from '@util/util';
import { Link, useHistory } from 'react-router-dom';
import axiosInstance from '@util/axiosInstance';
import { catalogContext } from '@context/catalog-context';

export default function ChapterHeader({
  userInfo = {},
  space = {}
}) {
  const { info: { catalog } } = useContext(catalogContext);
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const { pathname, search } = window.location;
  const { type = '', spaceId = '' } = parseUrlQuery();
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
  const onUpdateCatalog = useCallback(async ({ spaceId, catalog }) => {
    const [error, data] = await axiosInstance.post('spaces/update', {
      space_id: spaceId,
      catalog: JSON.stringify(catalog)
    });
    if (data && data.STATUS === 'OK') {
      history.push(`/spacedetail?spaceId=${spaceId}`);
    } else {
      console.log('[目录更新失败 ]', error);
    }
  }, []);
  return <div className="Chapter_Header flex">
    {visible && <CreateDoc onModalChange={(stat) => {
      setVisible(stat);
    }} />}
    <Breadcrumb crumbs={crumbs} />
    <div className="Chapter_Header_Operation flex">
      <Button
        content="新建文档"
        onClick={() => { setVisible(true); }} />
      {type.toLocaleLowerCase() === 'toc'
        ? <Button
          content="更新"
          onClick={() => onUpdateCatalog({
            spaceId,
            catalog
          })}
          type="primary" />
        : <Button>
          <Link to={`spacedetail?spaceId=${spaceId}&type=toc`}>编排目录</Link>
        </Button>}
    </div>
  </div>;
}