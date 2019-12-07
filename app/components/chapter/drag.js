import React, { useRef, useState, useEffect } from 'react';
import ChapterLayout from './chapter-layout';

export default function Drag({
  children,
  sourceItems = [],
  resetSourceItems = () => { }
}) {
  const dragBoxRef = useRef(null);
  const [snapshot, updateSnapshot] = useState({
    draggingFromThisWith: null
  });
  const [provided, updateProvided] = useState({
  });
  const chapterLayout = new ChapterLayout({
    items: sourceItems,
    setState: resetSourceItems,
    chapterBoxRef: dragBoxRef
  });
  // console.log(provided.innerRef.current);

  useEffect(() => {
    chapterLayout.init({ items: sourceItems, setState: resetSourceItems });
    chapterLayout.bindEvent();
    return () => {
      chapterLayout.removeEvent();
    };
  }, []);
  return (
    <div
      className="DragBox"
      ref={dragBoxRef}>
      {children(provided, snapshot)}
    </div>
  );
}