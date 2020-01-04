import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@common/icon';
import Tooltip from '@common/tooltip';
import { stringTransformToUrlObject, isEmptyObject, formatTimeStamp, checkBrowser } from '@util/util';
import { extractCatalog, toggleExpandCatalog } from '@util/commonFun';
import { fromNow } from '@util/fromNow';
import { catalogContext } from '@context/catalog-context';

const { isMobile } = checkBrowser();

export default function Catalog() {
  const { info: { catalog = [], docs = [] } } = useContext(catalogContext);
  const [catalogTrees, setCatalogTrees] = useState([]);

  // 目录展开
  const onToggleExpandCatalog = useCallback((trees, item, index) => {
    toggleExpandCatalog({ trees, item, index }, (result) => {
      setCatalogTrees(result);
    });
  }, []);

  useEffect(() => {
    setCatalogTrees(extractCatalog(catalog.slice(1)));
  }, [catalog]);

  if (catalogTrees.length === 0) {
    return null;
  }

  return <div className="Catalog">
    {
      catalogTrees.map((item, index) => {
        const doc = docs.find(n => n.doc_id === item.docId) || {};
        const isParenrt = item.children.length > 0;
        const isDelete = item.status === '0';
        const isEmptyNode = item.type === 'EMPTY_NODE';
        let classes = 'Catalog_Item flex ';
        classes += `${item.open ? 'Catalog_Item_Open' : ''} `;
        classes += `${isParenrt ? 'Catalog_Item_Parent' : ''} `;
        classes += `${isDelete ? 'Catalog_Item_Disabeld' : ''}`;
        if (isEmptyObject(doc)) {
          return null;
        }
        return (<div
          key={item.docId}
          style={{ marginLeft: `${Math.min(item.level, 3) * 40}px` }}
          className={classes}>
          <div className="Catalog_Item_Name flex ellipsis">
            {isParenrt && <Icon
              onClick={() => { onToggleExpandCatalog(catalogTrees, item, index); }}
              type="caret-down" />}
            {
              isDelete || isEmptyNode
                ? <span>{doc.title}</span>
                : <Link
                  className="ellipsis"
                  to={`${stringTransformToUrlObject(doc.url).pathname}`}
                  target="blank">
                  {doc.title}
                </Link>
            }
          </div>
          <Tooltip className="Catalog_Item_Update flex"
            tips="更新时间更新时间更新时间更新时间更新时间更新时间">
            {isMobile ? `${fromNow(doc.draft_update_at)}更新` : formatTimeStamp(doc.draft_update_at)}
          </Tooltip>
        </div>);
      })
    }
  </div>;
}