import React, { useState, useCallback } from 'react';
import Icon from '@common/icon';
import { Link } from 'react-router-dom';
import { stringTransformToUrlObject, formatTimeStamp } from '@util/util';

function findIndexByDocId(arr, docId) {
  return arr.findIndex(n => n.docId === docId);
};
function getEqualLevel(list, index, level) {
  const result = [];
  for (let i = index; i < list.length; i++) {
    if (list[i].level - level === 0) {
      result.push(list[i]);
    } else {
      break;
    }
  }
  return result;
}
function extractCatalog(source) {
  const sourceData = source.slice(0);
  function recursion(data, minLevel) {
    const result = [];
    if (!data || data.length === 0 || !data[0]) {
      return [];
    }
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      if (item.level === minLevel && findIndexByDocId(sourceData, item.docId) !== -1) {
        const newItem = {
          ...item,
          children: []
        };
        const sourceIndex = source.findIndex(n => n.docId === item.docId);
        const subSource = getEqualLevel(source, sourceIndex + 1, item.level + 1);
        newItem.children.push(...recursion(subSource, item.level + 1));
        result.push(newItem);
        sourceData.splice(findIndexByDocId(sourceData, item.docId), 1);
      }
    };
    return result;
  }
  return recursion(source, 0);
};

export default function Catalog({
  docs = [],
  catalog = []
}) {
  const [catalogTrees, setCatalogTrees] = useState(extractCatalog(catalog.slice(1)));
  const onToggleExpand = useCallback((trees, item, index) => {
    const { open = false, children = [], docId } = item;
    const result = trees.slice(0);
    result[index].open = !open;
    if (!open) {
      const subs = children.map(n => {
        return {
          ...n,
          belong: docId
        };
      });
      result.splice(index + 1, 0, ...subs);
      setCatalogTrees(result);
    } else {
      setCatalogTrees(result.filter(n => n.belong !== docId));
    }
  }, []);
  return <div className="Catalog">
    {
      catalogTrees.map((item, index) => {
        const doc = docs.find(n => n.doc_id === item.docId) || {};
        const isParenrt = item.children.length > 0;
        const classes = `Catalog_Item flex ${item.open ? 'Catalog_Item_Open' : ''} ${isParenrt ? 'Catalog_Item_Parent' : ''} Catalog_Item_${Math.min(item.level, 3)}`;
        return (<div
          key={item.docId}
          className={classes}>
          <div className="Catalog_Item_Name flex">
            {isParenrt && <Icon
              onClick={() => { onToggleExpand(catalogTrees, item, index); }}
              type="caret-down" />}
            <Link
              to={`${stringTransformToUrlObject(doc.url).pathname}`}
              target="blank">
              {doc.title}
            </Link>
          </div>
          <span className="Catalog_Item_Update flex">{formatTimeStamp(doc.draft_update_at)}</span>
        </div>);
      })
    }
  </div>;
}