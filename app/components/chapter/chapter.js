import React, { useContext } from 'react';
import CatalogDnd from '@components/catalog-dnd';
import { Empty } from 'xigua-components/dist/js';
import { extractCatalog } from '@util/commonFun';
import { catalogContext } from '@context/catalog-context';

export default function Chapter() {
  const { info: { catalog } } = useContext(catalogContext);

  if (!catalog || catalog.length <= 1) {
    return <Empty
      className="chapter_empty"
      description="该空间下暂无文档"
      image="/images/undraw_empty.svg" />;
  }
  return (
    <div className="chapter-toc">
      <CatalogDnd
        dragLists={extractCatalog(catalog.slice(1))}
        droppableId="catalog" />
    </div>
  );
}