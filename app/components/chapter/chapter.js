import React, { useState, useEffect, Fragment, useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ChapterLayout from '@components/chapter-layout';
import Icon from '@common/icon';
import Catalog from './catalog';
import axiosInstance from '@util/axiosInstance';
import { parseUrlQuery } from '@util/util';
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
  docs = [],
  space = {}
}) {
  const { updateCatalog } = useContext(catalogContext);
  const [state, setState] = useState({ items: catalog.slice(1) });
  const { type = '' } = parseUrlQuery();

  useEffect(() => {
    chapterLayout.init({
      items: state.items,
      setState: (d) => {
        setState(d);
        updateCatalog({ catalog: [catalog[0], ...d.items] });
      }
    });
    chapterLayout.bindEvent();
    return () => {
      chapterLayout.removeEvent();
    };
  }, []);
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
            </div>
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </div>;
  }
  if (catalog.length === 0) {
    return;
  }
  if (type.toLocaleLowerCase() !== 'toc') {
    return <Catalog
      space={space}
      catalog={catalog}
      docs={docs} />;
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
      {/* <Button
        className="Chapter_Update"
        content="更新目录"
        onClick={() => {
          onUpdateCatalog({
            spaceId: space.space_id,
            items: state.items,
            meta: catalog[0]
          });
        }}
        type="primary" /> */}
    </Fragment>
  );
}