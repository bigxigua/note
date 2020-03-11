import React, { useReducer, useEffect, useState } from 'react';
import Chapter from './chapter';
import ChapterHeader from './chapter-header';
import Catalog from './catalog';
import { catalogContext, catalogReducer, initialState } from '@context/catalog-context';
import { parseUrlQuery } from '@util/util';
import './index.css';

export default function ChapterWrapper({
  spaceInfo = {},
  userInfo = {}
}) {
  const [state, dispatch] = useReducer(catalogReducer, initialState);
  const [catalog, setCatalog] = useState(null);
  const { type = '' } = parseUrlQuery();

  const updateCatalog = (payload) => {
    dispatch({
      type: 'UPDATE_CATALOG',
      payload
    });
  };

  useEffect(() => {
    try {
      const d = JSON.parse(spaceInfo.space.catalog);
      updateCatalog({ catalog: d, docs: spaceInfo.docs });
      setCatalog(d);
    } catch (error) {
    }
  }, [spaceInfo.space]);
  // 服务端针对每个space保存一个json，用来描述这个space下属的文件的结构和顺序信息
  // 1.文档的展示顺序和json的结构顺序一致
  // 2. 调整顺序也是修改json数据顺序
  // 3. 调整文件为文件夹或者调整文件夹层级直接修改level属性
  // 4. 按顺序展示时，如果相邻2个元素level值不一样(且只能相差1)时，构造自己的childs

  // const catalog = [{
  //   display_level: 0, // 默认展示的层级
  //   max_level: 3, // 默认可创建的最大目录层级
  //   type: 'META' // 头一个为meta头部信息
  // }, {
  //   docId: '11', // 文档id
  //   level: 0, // 展示的时候显示在哪个层级，比如level=0，显示在最左侧，level=1显示offset=40的位置
  //   status: '0', // 该文档状态，0逻辑删除 1正常
  //   type: 'DOC' // 文档类型
  // }];

  return (
    <catalogContext.Provider value={{
      info: state,
      updateCatalog
    }}>
      <div className="Chapter">
        <ChapterHeader
          space={spaceInfo.space}
          userInfo={userInfo} />
        {
          type.toLocaleLowerCase() === 'toc'
            ? <Chapter />
            : <Catalog
              catalog={catalog}
              docs={spaceInfo.docs} />
        }
      </div>
    </catalogContext.Provider>
  );
};