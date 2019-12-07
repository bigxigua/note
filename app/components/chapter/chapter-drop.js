import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ChapterLayout from './chapter-layout';
// import Drag from './drag';
import Icon from '@common/icon';
const chapterLayout = new ChapterLayout();

export default function ChapterDrop({
  items = []
}) {
  const [state, setState] = useState({ items: items.slice(1) });
  useEffect(() => {
    chapterLayout.init({ items: state.items, setState });
    chapterLayout.bindEvent();
    return () => {
      chapterLayout.removeEvent();
    };
  }, []);
  function getStyle(style) {
    return {
      ...style,
      transitionDuration: '0'
    };
  }
  function renderDraggables(provided, snapshot) {
    chapterLayout.draggingFromThisWith = snapshot.draggingFromThisWith || 0;
    return <div
      {...provided.droppableProps}
      ref={provided.innerRef}
      className="Chapter_Drop_Box"
    >
      {state.items.map((item, index) => (
        <Draggable key={item.docId}
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
                {item.title}
              </h3>
              {/* <div><span>上次更新：</span>{formatTimeStamp(item.updated_at_timestamp)}</div> */}
              <div>{item.docId}-{item.level}</div>
            </div>
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </div>;
  }
  if (items.length === 0) {
    return;
  }
  return (
    <DragDropContext
      onDragUpdate={chapterLayout.onDragUpdate.bind(chapterLayout)}
      onDragEnd={chapterLayout.onDragEnd.bind(chapterLayout)}>
      <Droppable droppableId="droppable">
        {renderDraggables}
      </Droppable>
    </DragDropContext>
  );
}