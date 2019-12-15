import React, { useState, useCallback } from 'react';
import Icon from '@common/icon';
import { Link } from 'react-router-dom';
import { stringTransformToUrlObject, isEmptyObject, formatTimeStamp } from '@util/util';
import { extractCatalog, toggleExpandCatalog } from '@util/commonFun';

export default function Catalog({
  docs = [],
  catalog = []
}) {
  if (!Array.isArray(catalog) || catalog.length < 2) {
    return null;
  }
  const [catalogTrees, setCatalogTrees] = useState(extractCatalog(catalog.slice(1)));
  const onToggleExpandCatalog = useCallback((trees, item, index) => {
    toggleExpandCatalog({ trees, item, index }, (result) => {
      setCatalogTrees(result);
    });
  }, []);

  return <div className="Catalog">
    {
      catalogTrees.map((item, index) => {
        const doc = docs.find(n => n.doc_id === item.docId) || {};
        const isParenrt = item.children.length > 0;
        const isDelete = item.status === '0';
        let classes = `Catalog_Item flex ${item.open ? 'Catalog_Item_Open' : ''} ${isParenrt ? 'Catalog_Item_Parent' : ''}`;
        classes += isDelete ? 'Catalog_Item_Disabeld' : '';
        if (isEmptyObject(doc)) {
          return null;
        }
        return (<div
          key={item.docId}
          style={{ marginLeft: `${Math.min(item.level, 3) * 40}px` }}
          className={classes}>
          <div className="Catalog_Item_Name flex">
            {isParenrt && <Icon
              onClick={() => { onToggleExpandCatalog(catalogTrees, item, index); }}
              type="caret-down" />}
            {
              isDelete
                ? <span>{doc.title}</span>
                : <Link
                  to={`${stringTransformToUrlObject(doc.url).pathname}`}
                  target="blank">
                  {doc.title}
                </Link>
            }
          </div>
          <span className="Catalog_Item_Update flex">{formatTimeStamp(doc.draft_update_at)}</span>
        </div>);
      })
    }
  </div>;
}