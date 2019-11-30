import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { formatTimeStamp, throttle } from '@util/util';

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
function getElementPos() {
  return Array.from($('.Chapter_Item')).map(n => {
    const { x, y, width, height } = n.getBoundingClientRect();
    const id = n.getAttribute('data-tbid');
    const m = 8;
    return {
      x,
      y,
      id,
      w: width,
      h: height,
      calcSection: (p) => {
        return p > y && p <= y + height + m;
      }
    };
  });
}
function pauseEvent(e) {
  if (e.stopPropagation) e.stopPropagation();
  if (e.preventDefault) e.preventDefault();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}
let chapterBoxRef = null;

export default function ChapterDrop({
  list = []
}) {
  const [state, setState] = useState({ items: list });
  const onDragStart = result => {
    // bindEvent(elePos);
  };
  const createDashElement = function ([e]) {
    const { clientY } = e;
    const p = getElementPos();
    const curSection = p.filter(n => n.calcSection(clientY));
    if (curSection.length === 0) {
      return;
    }
    $('.Chapter_Item_Dash').remove();
    const { y, w, h } = curSection[0];
    const { x } = p.filter(n => !n.calcSection(clientY))[0];
    const dash = `<div class="Chapter_Item_Dash" style="left: ${x}px; top: ${y}px; height: ${h}px; width: ${w}px"></div>`;
    $('body').append($(dash));
  };
  // TODO drag/drop导致mouseup失效
  const debunceCreateDashElement = throttle(function () {
    createDashElement.call(this, Array.from(arguments));
  }, 500);
  const onMousemove = useCallback((e) => {
    console.log('onMousemove');
    debunceCreateDashElement(e);
    return pauseEvent(e);
  }, []);
  const onMousedown = useCallback((e) => {
    chapterBoxRef.addEventListener('mousemove', onMousemove, false);
    return pauseEvent(e);
  }, []);
  const onMouseup = useCallback(() => {
    console.log('onMouseup');
    chapterBoxRef.removeEventListener('mousemove', onMousemove);
  }, []);
  const bindEvent = () => {
    if (!chapterBoxRef) {
      chapterBoxRef = document.querySelector('.Chapter>div');
      chapterBoxRef.addEventListener('mousedown', onMousedown, false);
      chapterBoxRef.addEventListener('mouseup', onMouseup, false);
    }
  };
  const onDragUpdate = result => {
    if (!result.destination) {
      return;
    }
    $('.Chapter_Item_Dash').remove();
    bindEvent();
  };
  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      state.items,
      result.source.index,
      result.destination.index
    );
    setState({ items });
  };
  function renderDraggables(provided) {
    return <div
      {...provided.droppableProps}
      ref={provided.innerRef}
      className="Chapter_Drop_Box"
    >
      {state.items.map((item, index) => (
        <Draggable key={item.doc_id}
          draggableId={String(item.doc_id)}
          index={index}>
          {(provided) => (
            <div
              className={`Chapter_Item ${item.doc_id === 'dashed' ? 'Chapter_Item_Dash' : ''}`}
              data-tbid={item.doc_id}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <h3>{item.title}</h3>
              <div><span>上次更新：</span>{formatTimeStamp(item.updated_at_timestamp)}</div>
            </div>
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </div>;
  }
  useEffect(() => {
    bindEvent();
  }, []);
  return (
    <DragDropContext
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {renderDraggables}
      </Droppable>
    </DragDropContext>
  );
}