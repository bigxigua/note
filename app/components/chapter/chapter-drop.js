import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { formatTimeStamp, throttle, getIn } from '@util/util';
import Icon from '@common/icon';

// ！！！！目录编排目前只支持最多3层

const OFFSET_NAME_MAPS = {
  40: 'Chapter_Item_Offset_40',
  80: 'Chapter_Item_Offset_80'
};
const OFFSET = [40, 80];

function getElementPos() {
  return Array.from(document.querySelectorAll('.Chapter_Item')).map((n, i) => {
    const { x, y, width, height } = n.getBoundingClientRect();
    const id = n.getAttribute('data-tbid');
    const m = 8;
    return {
      x,
      y,
      id,
      w: width,
      h: height,
      index: i,
      folder: false,
      calcSection: (p) => {
        return p > y && p <= y + height + m;
      }
    };
  });
}
const createDashElement = function ([e]) {
  const { clientY } = e;
  const curSection = draggablePos.filter(n => n.calcSection(clientY));
  if (curSection.length === 0) {
    return;
  }
  $('.Chapter_Item_Dash').remove();
  const { x, y, w, h } = curSection[0];
  const draggingEleIndex = getIn(draggablePos.filter(n => n.id === draggingFromThisWith), [0, 'index'], 'NONE');
  if (draggingEleIndex === 'NONE') {
    return;
  }
  const curElement = document.querySelectorAll('.Chapter_Item')[draggingEleIndex];
  const disparity = curElement.getBoundingClientRect().x - x;
  let offset = 0;
  // 如果当前是拖拽目录，目录下的所有元素要一起移动
  if (disparity >= OFFSET[0]) {
    offset = OFFSET[0];
  }
  if (disparity >= OFFSET[1]) {
    offset = OFFSET[1];
  }
  const dash = `<div class="Chapter_Item_Dash" style="left: ${x + offset}px; top: ${y}px; height: ${h}px; width: ${w}px"></div>`;
  draggablePos[draggingEleIndex].offset = offset;
  $('body').append($(dash));
};
function getTargetClassName(target) {
  if (!target) {
    return [];
  }
  const c = target.getAttribute('class');
  if (!c || /^\s+$/.test(c)) {
    return getTargetClassName(target.parentElement);
  }
  return c.split(' ');
}
let chapterBoxRef = null;
let draggablePos = null;
let draggingFromThisWith = null;

export default function ChapterDrop({
  list = []
}) {
  const [state, setState] = useState({ items: list });
  const throttleCreateDashElement = throttle(function () {
    createDashElement.call(this, Array.from(arguments));
  }, 0);
  const onMousemove = useCallback((e) => {
    throttleCreateDashElement(e);
  }, []);
  const onMousedown = useCallback((e) => {
    if (!draggablePos) {
      draggablePos = getElementPos();
    }
    if (!getTargetClassName(e.target).includes('Chapter_Item')) {
      return;
    }
    chapterBoxRef.addEventListener('mousemove', onMousemove, false);
  }, []);
  const onMouseup = useCallback(() => {
    removeEvent();
  }, []);
  const bindEvent = useCallback(() => {
    if (!chapterBoxRef) {
      chapterBoxRef = document;
      chapterBoxRef.addEventListener('mousedown', onMousedown, false);
      chapterBoxRef.addEventListener('mouseup', onMouseup, false);
    } else {
      chapterBoxRef.addEventListener('mousemove', onMousemove, false);
    }
  }, []);
  const removeEvent = useCallback(() => {
    chapterBoxRef.removeEventListener('mousemove', onMousemove);
    $('.Chapter_Item_Dash').remove();
  }, []);
  const onDragUpdate = result => {
    if (!result.destination) {
      return;
    }
    bindEvent();
  };
  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    const {
      source: { index: sourceIndex },
      destination: { index: destinationIndex }
    } = result;
    const items = state.items;
    const [removed] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, removed);
    removeEvent();
    // items新增offset,检测上面是否是folder，如果是folder，非folder加40
    if (destinationIndex > 0) {
      const prev = items[destinationIndex - 1];
      const prevOffset = prev.offset || 0;
      const curOffset = draggablePos[destinationIndex].offset || 0;
      // const prevIsFolder = prev.folder;
      const curIsFolder = items[destinationIndex].folder;
      if (curOffset > prevOffset) {
        console.log('相对于上一个元素右移');
        // 相对于上一个元素右移
        prev.folder = true;
        items[destinationIndex].belong = prev.doc_id;
        // 当前移动元素偏移量为上一个元素偏移量+最小移动值
        items[destinationIndex].offset = prevOffset + OFFSET[0];
        if (curIsFolder) {
          items[destinationIndex].folder = false;
        }
      } else {
        console.log('相对于上一个元素左移或同级');
        // 相对于上一个元素左移或同级
        prev.folder = false;

        // items[destinationIndex].belong = prev.doc_id;
        // 当前移动项为folder或者是某个的下属，需同时移动下属项
        if (curIsFolder) {
          items[destinationIndex].folder = false;
          const sub = [];
          for (let i = destinationIndex; i < items.length; i++) {
            if (items[i].belong &&
              items[destinationIndex].offset !== curOffset &&
              (items[i].belong === items[destinationIndex].doc_id)) {
              sub.push(i);
            }
          }
          sub.forEach(n => {
            items[n].offset = curOffset;
          });
          console.log('sub:', sub);
        }
        // 判断是否还有同级元素
        const same = [];
        for (let i = destinationIndex + 1; i < items.length; i++) {
          if (items[i].belong &&
            items[destinationIndex].offset !== curOffset &&
            !curIsFolder &&
            (items[i].belong === items[destinationIndex].belong)) {
            same.push(i);
          }
        }
        if (same.length > 0) {
          // 下一个是否是
          console.log('same:', same);
          items[destinationIndex].folder = true;
          same.forEach(n => {
            items[n].belong = items[destinationIndex].doc_id;
          });
        }
        // 同级时belong为prev belong
        if (curOffset === prevOffset) {
          items[destinationIndex].belong = prev.belong;
        }
        items[destinationIndex].offset = curOffset;
      }
    }
    items.forEach((n, i) => {
      draggablePos[i].id = n.doc_id;
      draggablePos[i].folder = n.folder;
    });
    // destinationIndex的上一个新增folder属性,检查前面的元素是否已经有是folder存在
    setState({ items });
  };

  function renderDraggables(provided, snapshot) {
    draggingFromThisWith = snapshot.draggingFromThisWith;
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
              className={`Chapter_Item ${OFFSET_NAME_MAPS[item.offset] || ''}`}
              data-tbid={item.doc_id}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <h3>
                {item.folder && <Icon type="caret-down" />}
                {item.doc_id}
              </h3>
              {/* <div><span>上次更新：</span>{formatTimeStamp(item.updated_at_timestamp)}</div> */}
              <div>{item.belong}</div>
            </div>
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </div>;
  }
  useEffect(() => {
    bindEvent();
    return () => {
      removeEvent();
    };
  }, []);
  return (
    <DragDropContext
      scrollable={false}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {renderDraggables}
      </Droppable>
    </DragDropContext>
  );
}