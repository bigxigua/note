import React, { useState, useEffect, Fragment, useContext, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { NavLink } from 'react-router-dom';
import ChapterLayout from '@components/chapter-layout';
import InsertCatalog from '@components/insert-catalog';
import Popover from '@components/popover';
import Icon from '@common/icon';
import List from '@common/list';
import Empty from '@common/empty';
import { isEmptyObject } from '@util/util';
import { deleteDoc } from '@util/commonFun';
import { fromNow } from '@util/fromNow';
import { catalogContext } from '@context/catalog-context';

const chapterLayout = new ChapterLayout();

const settingList = [{
  text: '删除',
  icon: 'delete',
  key: 'delete'
}, {
  text: '编辑',
  icon: 'edit',
  key: 'edit'
}];

function getStyle(style) {
  return {
    ...style,
    transitionDuration: '0'
  };
}

function onPopoverItemClick(info, docInfo, e, catalog) {
  const { key } = info;
  const {
    doc_id: docId,
    space_id: spaceId,
    title: docTitle
  } = docInfo;
  e.stopPropagation();
  if (key === 'edit') {
    window.location.href = `/simditor/${docId}/?spaceId=${spaceId}`;
  } else if (key === 'delete') {
    deleteDoc({
      catalog,
      docTitle,
      docId,
      spaceId
    }, (success) => { success && window.location.reload(); });
  }
}

export default function Chapter() {
  const { info: { catalog, docs }, updateCatalog } = useContext(catalogContext);
  const [state, setState] = useState({ items: catalog.slice(1) });
  const [tocStyle, setTocStyle] = useState({});

  useEffect(() => {
    const [meta, ...items] = catalog;
    chapterLayout.init({
      items,
      setState: ({ items: lists, sourceIndex }) => {
        setState({ items: lists });
        onDragItemClick(lists[sourceIndex], sourceIndex, lists);
        updateCatalog({ catalog: [meta, ...lists] });
      }
    });
    setState({ items });
    onDragItemClick(items[0], 0, items);
    chapterLayout.bindEvent();
    return () => chapterLayout.removeEvent();
  }, [catalog.length]);

  // 点击被拖动项时设置新增节点元素的位置
  const onDragItemClick = useCallback((item, index, items) => {
    if (!item) return;
    let level = Math.min(item.level, 3);
    const nextItem = items[index + 1];
    if (nextItem && nextItem.level - level === 1) {
      level = nextItem.level;
    }
    setTocStyle({
      left: level * 40 - 40,
      top: (index + 1) * 44 + index * 16 + 8,
      index,
      level
    });
  }, []);

  if (!catalog || catalog.length === 0 || !docs || docs.length === 0) {
    return <Empty
      className="chapter_empty"
      description="该空间下暂无文档"
      image="/images/undraw_empty.svg" />;
  }

  function renderDraggables(provided, snapshot) {
    chapterLayout.draggingFromThisWith = snapshot.draggingFromThisWith || 0;
    return <div
      {...provided.droppableProps}
      ref={provided.innerRef}
      className="chapter-drop__box"
    >
      <InsertCatalog position={tocStyle} />
      {state.items.map((item, index) => {
        const docInfo = docs.find(n => n.doc_id === item.docId) || {};
        let classes = `Chapter_Item Chapter_Item_${item.docId}`;
        classes += ` Chapter_Item_${Math.min(item.level, 3)}`;
        classes += `${docInfo.status === '0' ? ' chapter-item__disabled' : ''}`;
        if (isEmptyObject(docInfo)) {
          return null;
        }
        const isParantNode = chapterLayout.whetherDisplayCaretDown(item, index, state.items);
        return <Draggable
          key={item.docId}
          draggableId={String(item.docId)}
          index={index}>
          {(provided) => (
            <div
              onClick={() => { onDragItemClick(item, index, state.items); }}
              className={classes}
              data-tbid={item.docId}
              data-offset={Math.min(item.level, 3) || 0}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getStyle(provided.draggableProps.style)}
            >
              <div className="flex">
                {isParantNode && <Icon type="caret-down" />}
                {docInfo.title}
              </div>
              <div className="chapter-item__info">
                <span>{fromNow(docInfo.updated_at_timestamp)}更新</span>
                <Popover
                  className="chapter-item__setting"
                  content={<List
                    style={{ boxShadow: 'none', padding: 0 }}
                    onTap={(info, index, event) => { onPopoverItemClick(info, docInfo, event, catalog); }}
                    list={settingList} />}>
                  <Icon type="ellipsis" />
                </Popover>
              </div>
            </div>
          )}
        </Draggable>;
      })}
      {provided.placeholder}
    </div>;
  }
  return (
    <Fragment>
      <DragDropContext
        onDragUpdate={chapterLayout.onDragUpdate.bind(chapterLayout)}
        onDragEnd={chapterLayout.onDragEnd.bind(chapterLayout)}>
        <Droppable droppableId="droppable">
          {renderDraggables}
        </Droppable>
      </DragDropContext>
    </Fragment>
  );
}