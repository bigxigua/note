import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ChapterLayout from './chapter-layout';
import Icon from '@common/icon';
const chapterLayout = new ChapterLayout();

const OFFSET_NAME_MAPS = {
  40: 'Chapter_Item_Offset_40',
  80: 'Chapter_Item_Offset_80'
};

export default function ChapterDrop({
  items = []
}) {
  const [state] = useState({ items });
  useEffect(() => {
    chapterLayout.init({ items });
    chapterLayout.bindEvent();
    return () => {
      chapterLayout.removeEvent();
    };
  }, []);
  function renderDraggables(provided, snapshot) {
    chapterLayout.draggingFromThisWith = snapshot.draggingFromThisWith;
    return <div
      {...provided.droppableProps}
      ref={provided.innerRef}
      className="Chapter_Drop_Box"
    >
      {state.items.slice(1).map((item, index) => (
        <Draggable key={item.docId}
          draggableId={String(item.docId)}
          index={index}>
          {(provided) => (
            <div
              className={`Chapter_Item Chapter_Item_${Math.min(item.level, 3)}`}
              data-tbid={item.docId}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <h3>
                {chapterLayout.whetherDisplayCaretDown(item, index, state.items) && <Icon type="caret-down" />}
                {item.title}
              </h3>
              {/* <div><span>上次更新：</span>{formatTimeStamp(item.updated_at_timestamp)}</div> */}
              <div>{item.docId}</div>
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
      scrollable={false}
      onDragUpdate={chapterLayout.onDragUpdate.bind(chapterLayout)}
      onDragEnd={chapterLayout.onDragEnd.bind(chapterLayout)}>
      <Droppable droppableId="droppable">
        {renderDraggables}
      </Droppable>
    </DragDropContext>
  );
}