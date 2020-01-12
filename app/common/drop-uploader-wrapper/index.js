import React, { useCallback, useRef, useEffect, useContext } from 'react';
import editorContext from '@context/editor/editorContext';
import uploader from '@util/uploader';
import { UPLOAD_DOMAIN } from '@config/index';
import { getIn } from '@util/util';
import './index.css';

const ondragenter = () => {
};
const ondragover = (e) => {
  e.preventDefault();
};
const noop = () => { };

function asyncUploader({ onProgress = noop, file, fileId }) {
  return new Promise((resolve) => {
    uploader({
      onProgress: (e) => {
        console.log('onProgress:', e);
        onProgress(e);
        // const { fileList } = ctx.state;
        // const curIndex = fileList.findIndex(n => n.fileId === fileId);
        // const percent = (e.total > 0) ? e.loaded / e.total * 100 : 0;
        // if (curIndex !== -1) {
        //   fileList[curIndex].percent = percent;
        // }
      },
      onError: (e) => {
        resolve([e || {}, null]);
      },
      onSuccess: (e) => {
        resolve([null, e]);
      },
      data: { fileId },
      filename: 'file',
      file,
      withCredentials: true,
      action: `${UPLOAD_DOMAIN}/image`,
      headers: []
    });
  });
}

export default function DropUploaderWrapper({
  id = '',
  children = null,
  className = ''
}) {
  const { editor } = useContext(editorContext);
  const dropRef = useRef(null);

  const bindEvent = useCallback((editormd) => {
    const ondrop = async (e) => {
      e.preventDefault();
      // 1. 获取files, 最多一次性上传1张图片
      const files = Array.from(e.dataTransfer.files).slice(0, 1);
      // 上传图片
      const [error, data] = await asyncUploader({ file: files[0], fileId: Date.now() });
      const path = getIn(data, ['data', 'path']);
      if (path) {
        // 显示上传图片弹框

        // editormd.cm.replaceSelection(`<img src="${path}" />`);
      }
      console.log(error, data, path);
    };
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
    const events = bindEvent(editor);
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