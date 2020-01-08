import React, { useCallback, useRef, useEffect, useContext } from 'react';
import editorContext from '@context/editor/editorContext';
import './index.css';

const ondragenter = () => {
  console.log('----ondragenter----');
};
const ondragover = (e) => {
  e.preventDefault();
  console.log('----ondragover----');
};
const ondrop = (e) => {
  e.preventDefault();
  console.log('----ondrop----');
};

export default function DropUploaderWrapper({
  id = '',
  children = null,
  className = ''
}) {
  const { editor } = useContext(editorContext);
  const dropRef = useRef(null);

  const bindEvent = useCallback(() => {
    console.log(editor);
    dropRef.current.addEventListener('dragenter', ondragenter, false);
    dropRef.current.addEventListener('dragover', ondragover, false);
    dropRef.current.addEventListener('drop', ondrop, false);
    return [{
      name: 'dragenter',
      fn: ondragenter
    }, {
      name: 'dragover',
      fn: ondragover
    }, {
      name: 'drop',
      fn: ondrop
    }];
  }, []);

  useEffect(() => {
    if (!editor) return;
    const events = bindEvent();
    return () => {
      events.forEach(({ name, fn }) => {
        dropRef.current.removeEventListener(name, fn);
      });
    };
  }, [editor]);

  return (
    <div
      id={id}
      ref={dropRef}
      className={`drop_wrapper ${className}`}>
      {children}
    </div>
  );
};