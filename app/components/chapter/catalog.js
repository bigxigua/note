import React from 'react';
import Icon from '@common/icon';
import { Link } from 'react-router-dom';
import { stringTransformToUrlObject, formatTimeStamp } from '@util/util';

function whetherDisplayCaretDown(item, index, list) {
  const items = list.filter(n => n.type !== 'META');
  if (index === items.length - 1) {
    return false;
  }
  if (item.level < items[index + 1].level) {
    return true;
  }
}

export default function Catalog({
  docs = [],
  catalog = []
}) {
  return <div className="Catalog">
    {
      catalog.slice(1).map((item, index) => {
        const doc = docs.find(n => n.doc_id === item.docId) || {};
        const isParenrt = whetherDisplayCaretDown(item, index, catalog);
        return <div
          className={`Catalog_Item flex ${isParenrt ? 'Catalog_Item_Parent' : ''} Catalog_Item_${Math.min(item.level, 3)}`}
          key={item.docId}>
          <div className="Catalog_Item_Name flex">
            {isParenrt && <Icon type="caret-down" />}
            <Link
              to={`${stringTransformToUrlObject(doc.url).pathname}`}
              target="blank">{item.title}</Link>
          </div>
          <span className="Catalog_Item_Update flex">{formatTimeStamp(doc.draft_update_at)}</span>
        </div>;
      })
    }
  </div>;
}