import React, { useState, useCallback, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CatalogDndItem from '@components/catalog-dnd-item';
import { catalogContext } from '@context/catalog-context';
import { isEmptyObject } from '@util/util';
import './index.css';

function getSubs(catalogs, index, level) {
  const subs = [];
  for (let i = index + 1; i < catalogs.length; i++) {
    const n = catalogs[i];
    if (n.level <= level) {
      break;
    }
    subs.push(n);
  };
  return subs;
};

// 上移和下移
function exChange(catalogs, sourceItem, destinationItem) {
  const sourceIndex = catalogs.findIndex(n => n.docId === sourceItem.docId);
  const destinationIndex = catalogs.findIndex(n => n.docId === destinationItem.docId);
  const sourceSubs = getSubs(catalogs, sourceIndex, sourceItem.level);
  const destinationSubs = getSubs(catalogs, destinationIndex, destinationItem.level);
  if (sourceIndex < destinationIndex /* 下移 */) {
    catalogs.splice(destinationIndex + destinationSubs.length + 1, 0, ...[sourceItem, ...sourceSubs]);
    catalogs.splice(sourceIndex, sourceSubs.length + 1);
  }
  if (sourceIndex > destinationIndex /* 上移 */) {
    catalogs.splice(sourceIndex, sourceSubs.length + 1);
    catalogs.splice(destinationIndex, 0, ...[sourceItem, ...sourceSubs]);
  }
  return catalogs;
}

/**
* react-beautiful-dnd封装
* @param {ReactNode} dragnode drag项
* @param {String} droppableId 该DragDropContext的唯一key
*/
export default function CatalogDnd({
  dragLists = [],
  droppableId
}) {
  // 记录平移时被拖动元素的水平方向偏移量。
  const { info: { catalog, docs }, updateCatalog } = useContext(catalogContext);
  const onDragEnd = useCallback((result) => {
    if (!result.destination) {
      return;
    }
    const {
      source: { index: sourceIndex }, // 当前drag元素位置
      destination: { index: destinationIndex } // 被放下位置
    } = result;
    if (sourceIndex === destinationIndex) {
      return;
    }
    const newCatalogs = exChange(catalog, dragLists[sourceIndex], dragLists[destinationIndex]);
    updateCatalog(newCatalogs);
  }, [dragLists, catalog]);
  const onOffsetChange = useCallback((docId, type) => {
    const catalogCopy = catalog.slice(0);
    const index = catalogCopy.findIndex(n => n.docId === docId);
    if (index !== -1) {
      const item = catalogCopy[index];
      const subs = getSubs(catalogCopy, index, item.level);
      [item, ...subs].forEach(n => {
        const i = catalogCopy.findIndex(m => m.docId === n.docId);
        if (type === 'right') {
          catalogCopy[i].level++;
        } else {
          catalogCopy[i].level--;
        }
      });
      updateCatalog(catalogCopy);
    }
  }, [catalog]);
  return (
    <DragDropContext
      onDragEnd={onDragEnd}>
      <Droppable droppableId={droppableId}>
        {
          (provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="chapter-drop__box">
              {
                dragLists.map((item, index) => {
                  const children = item.children;
                  const docInfo = docs.find(n => n.doc_id === item.docId) || {};
                  if (isEmptyObject(docInfo)) {
                    return null;
                  }
                  return <Draggable
                    key={item.docId}
                    index={index}
                    draggableId={item.docId}>
                    {
                      (provided) => {
                        return <CatalogDndItem
                          provided={provided}
                          index={index}
                          curCatalogInfo={item}
                          childrenLen={children.length}
                          docInfo={docInfo}
                          onOffsetChange={onOffsetChange}>
                          {
                            children.length
                              ? <CatalogDnd
                                docs={docs}
                                dragLists={children}
                                droppableId={item.docId} />
                              : null
                          }
                        </CatalogDndItem>;
                      }
                    }
                  </Draggable>;
                })
              }
            </div>
          )
        }
      </Droppable>
    </DragDropContext >
  );
};