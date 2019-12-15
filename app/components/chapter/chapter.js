import React, { useState, useEffect, Fragment, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ChapterLayout from '@components/chapter-layout';
import Icon from '@common/icon';
import { formatTimeStamp, isEmptyObject } from '@util/util';
import { catalogContext } from '@context/catalog-context';
const chapterLayout = new ChapterLayout();

function getStyle(style) {
  return {
    ...style,
    transitionDuration: '0'
  };
}

export default function Chapter({
  catalog = [],
  docs = []
}) {
  const { updateCatalog } = useContext(catalogContext);
  const [state, setState] = useState({ items: catalog.slice(1) });

  useEffect(() => {
    chapterLayout.init({
      items: catalog.slice(1),
      setState: (d) => {
        setState(d);
        updateCatalog({ catalog: [catalog[0], ...d.items] });
      }
    });
    setState({ items: catalog.slice(1) });
    chapterLayout.bindEvent();
    return () => chapterLayout.removeEvent();
  }, [catalog.length]);

  if (!catalog || catalog.length === 0 || !docs || docs.length === 0) {
    return null;
  }
  function renderDraggables(provided, snapshot) {
    chapterLayout.draggingFromThisWith = snapshot.draggingFromThisWith || 0;
    return <div
      {...provided.droppableProps}
      ref={provided.innerRef}
      className="Chapter_Drop_Box"
    >
      {state.items.map((item, index) => {
        const docInfo = docs.find(n => n.doc_id === item.docId) || {};
        if (isEmptyObject(docInfo)) {
          return null;
        }
        return <Draggable key={item.docId}
          draggableId={String(item.docId)}
          index={index}>
          {(provided) => (
            <div
              className={`Chapter_Item Chapter_Item_${item.docId} Chapter_Item_${Math.min(item.level, 3)}`}
              data-tbid={item.docId}
              data-offset={Math.min(item.level, 3)}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getStyle(provided.draggableProps.style)}
            >
              <h3>
                {chapterLayout.whetherDisplayCaretDown(item, index, state.items) && <Icon type="caret-down" />}
                {docInfo.title}
              </h3>
              <div><span>上次更新：</span>{formatTimeStamp(docInfo.updated_at_timestamp)}</div>
            </div>
          )}
        </Draggable>;
      })}
      {provided.placeholder}
    </div>;
  }
  if (catalog.length === 0) {
    return;
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