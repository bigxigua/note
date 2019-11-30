import React from 'react';
import ChapterDrop from './chapter-drop';
import './index.css';

export default function Chapter({
  spaceInfo = {}
}) {
  if (spaceInfo.docs.length === 0) {
    return null;
  }
  return (
    <div className="Chapter">
      <ChapterDrop list={spaceInfo.docs} />
    </div>
  );
};